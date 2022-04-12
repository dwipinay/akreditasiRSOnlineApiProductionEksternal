const userIP = require('../models/UserIP')

class UserIPController {
    authenticateIP(req, res, next) {
        const requestIP = req.socket.remoteAddress.toString().replace('::ffff:', '')
        const userIPObject = new userIP()
        userIPObject.authenticateIP(requestIP, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if(result.length) { 
                next()
            } else {
                res.status(403).send({
                    status: false,
                    message: `${requestIP} not registered`
                })
            }
        })
    }
}

module.exports = UserIPController