const pool = require('../configs/pool')
const Database = require('./Database')

class UserIP {
    authenticateIP(req, callback) {
        const database = new Database(pool)
        const sql = 'SELECT db_api_auth.user.user_name, ' +
        'db_api_auth.user.password ' +
        'FROM db_api_auth.user ' +
        'WHERE db_api_auth.user.ip_address = ? AND ' +
        'db_api_auth.user.activated_date <= NOW() AND ' +
        'db_api_auth.user.expired_date >= NOW() AND ' +
        'db_api_auth.user.is_active = 1 '
        const filterValue = [
            req
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

module.exports = UserIP