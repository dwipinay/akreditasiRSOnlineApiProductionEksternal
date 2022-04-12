require('dotenv').config()

const bcrypt = require('bcrypt')
const saltRound = 10
const UserCredential = require('../models/UserCredential')
const jwt = require('jsonwebtoken')
const dateFormat = require("dateformat");
const Joi = require('joi')
const generatePassword = require('password-generator')

class userCredentialController {
    store(req, res) {
        const schema = Joi.object({
            userName: Joi.string()
                .required(),
                
            fullName: Joi.string()
                .required(),
            
            appName: Joi.string()
                .required(),

            stakeHolderName: Joi.string()
                .required(),
            
            ipAddress: Joi.string()
                .required(),
            
            activatedDate: Joi.string()
                .required(),
                
            expiredDate: Joi.string()
                .required(),
            
            isActive: Joi.string()
                .required(),
            
            faskesId: Joi.string()
                .required()
                .allow(null)
        });

        const { error, value } =  schema.validate(req.body)
        
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        const plainPassword = generatePassword(8, false)
        
        bcrypt.hash(plainPassword, saltRound, (err, hash) => {
            const data = {
                userName: req.body.userName,
                plainPassword: plainPassword,
                hashPassword: hash,
                fullName: req.body.fullName,
                appName: req.body.appName,
                stakeHolderName: req.body.stakeHolderName,
                ipAddress: req.body.ipAddress,
                activatedDate: req.body.activatedDate,
                expiredDate: req.body.expiredDate,
                isActive: req.body.isActive,
                faskesId: req.body.faskesId
            }
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }

            const userCredentialObject = new UserCredential()
            userCredentialObject.insertData(data, (err, result) => {
                if (err) {
                    res.status(422).send({
                        status: false,
                        message: err
                    })
                    return
                }
                res.status(201).send({
                    status: true,
                    message: "data created",
                    data: result
                })
            })
        })
    }

    authenticateCredentialFasyankes(req, res) {
        const requestIP = req.socket.remoteAddress.toString().replace('::ffff:', '')
        
        const data = {
            userName: req.body.userName,
            password: req.body.password,
            requestIP: requestIP
        }
        
        const userCredentialObject = new UserCredential()
        userCredentialObject.authenticateCredentialFasyankes(data, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if(!result.length) {
                res.status(401).send({
                    status:false,
                    message: "Unauthorized"
                })
                return
            }
            bcrypt.compare(req.body.password, result[0].password, (err2, res2) => {
                if(res2 == false) {
                    res.status(401).send({
                        status: false,
                        message: 'Unauthorized'
                    })
                    return;
                }
                // const user = JSON.parse(JSON.stringify(results[0]))
                const payloadObject = {
                    user_name: result[0].user_name,
                    kode_rs: result[0].faskes_id
                }
                const accessToken = jwt.sign(payloadObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN})
                jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
                    // console.log(result)
                    const refreshToken = jwt.sign(payloadObject, process.env.REFRESH_TOKEN_SECRET)
                    const iat = dateFormat(new Date(result.iat * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                    const exp = dateFormat(new Date(result.exp * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                    res.status(201).send({
                        status: true,
                        message: "access token created",
                        data: {
                            access_token: accessToken,
                            issued_at: iat,
                            expired_at: exp,
                            expires_in: process.env.ACCESS_TOKEN_EXPIRESIN
                        }
                    })
                })
            })
        })
    }

    authenticateCredentialNonFasyankes(req, res) {
        const requestIP = req.socket.remoteAddress.toString().replace('::ffff:', '')
        
        const data = {
            userName: req.body.userName,
            password: req.body.password,
            requestIP: requestIP
        }
        
        const userCredentialObject = new UserCredential()
        userCredentialObject.authenticateCredentialNonFasyankes(data, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if(!result.length) {
                res.status(401).send({
                    status:false,
                    message: "Unauthorized"
                })
                return
            }
            bcrypt.compare(req.body.password, result[0].password, (err2, res2) => {
                if(res2 == false) {
                    res.status(401).send({
                        status: false,
                        message: 'Unauthorized'
                    })
                    return;
                }
                // const user = JSON.parse(JSON.stringify(results[0]))
                const payloadObject = {
                    id: result[0].id,
                    user_name: result[0].user_name,
                    kode_rs: result[0].faskes_id
                }

                const accessToken = jwt.sign(payloadObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN})
                jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
                    // console.log(result)
                    const refreshToken = jwt.sign(payloadObject, process.env.REFRESH_TOKEN_SECRET)
                    const iat = dateFormat(new Date(result.iat * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                    const exp = dateFormat(new Date(result.exp * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                    res.status(201).send({
                        status: true,
                        message: "access token created",
                        data: {
                            access_token: accessToken,
                            issued_at: iat,
                            expired_at: exp,
                            expires_in: process.env.ACCESS_TOKEN_EXPIRESIN
                        }
                    })
                })
            })
        })
    }
}

module.exports = userCredentialController