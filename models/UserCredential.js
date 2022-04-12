const pool = require('../configs/pool')
const nodemailer = require("nodemailer")
const smtpTransport = require('nodemailer-smtp-transport')
const Database = require('./Database')

class UserCredential {
    insertData(credential, callback) {
        const database = new Database(pool)
        const sql = 'INSERT INTO db_api_auth.user ' +
            '( ' +
                'user_name, ' +
                'password, ' +
                'full_name, ' +
                'app_name, ' +
                'stakeholder_name, ' +
                'ip_address, ' +
                'activated_date, ' +
                'expired_date, ' +
                'is_active, ' +
                'faskes_id ' +
            ') ' +
            'VALUES ( ? )'

        const record = [
            credential.userName,
            credential.hashPassword,
            credential.fullName,
            credential.appName,
            credential.stakeHolderName,
            credential.ipAddress,
            credential.activatedDate,
            credential.expiredDate,
            credential.isActive,
            credential.faskesId
        ]

        database.query(sql, [record]).then(
            (results) => {

                var transporter = nodemailer.createTransport(smtpTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: 'infomonev.yankes@gmail.com',
                        pass: 'P@55w0rd1n3v!@#$%'
                    }
                }))
                
                const message = `<p>Yth. ${credential.fullName}</p> 
                <p>Berikut kami informasikan password untuk Api RS Online : <b>${credential.plainPassword}</b></p>`
                var mailOptions = {
                    from: 'infomonev.yankes@gmail.com',
                    to: credential.userName,
                    subject: 'Password Api RS Online',
                    html: message
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    // if (error) {
                    //     console.log(error);
                    // } else {
                    //     console.log('Email sent: ' + info.response);
                    // }
                    callback(null, credential.plainPassword)
                }); 

            },(error) => {
                throw error
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }

    authenticateCredentialFasyankes(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT db_api_auth.user.user_name, ' +
        'db_api_auth.user.password, db_api_auth.user.faskes_id ' +
        'FROM db_api_auth.user ' +
        'WHERE db_api_auth.user.user_name = ? AND ' +
        'db_api_auth.user.faskes_id IS NOT NULL AND ' +
        'db_api_auth.user.activated_date <= NOW() AND ' +
        'db_api_auth.user.expired_date >= NOW() AND ' +
        'db_api_auth.user.is_active = 1 '
        const filterValue = [
            user.userName
        ]
        database.query(sql, filterValue).then(
            (results) => {
                callback(null, results)
            },(error) => {
                throw errorß
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }

    authenticateCredentialNonFasyankes(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT db_api_auth.user.id, ' +
        'db_api_auth.user.user_name, ' +
        'db_api_auth.user.password, db_api_auth.user.faskes_id ' +
        'FROM db_api_auth.user ' +
        'WHERE db_api_auth.user.user_name = ? AND ' +
        'db_api_auth.user.ip_address = ? AND  ' +
        'db_api_auth.user.faskes_id IS NULL AND ' +
        'db_api_auth.user.activated_date <= NOW() AND ' +
        'db_api_auth.user.expired_date >= NOW() AND ' +
        'db_api_auth.user.is_active = 1 '
        const filterValue = [
            user.userName,
            user.requestIP
        ]
        database.query(sql, filterValue).then(
            (results) => {
                callback(null, results)
            },(error) => {
                throw error
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = UserCredential