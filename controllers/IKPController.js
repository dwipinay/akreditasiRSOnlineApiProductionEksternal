const ikp = require('../models/IKP')
const Joi = require('joi')
class IkpController {
    index(req, res) {
        const ikpObject = new ikp()
        ikpObject.getData(req, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            res.status(200).send({
                status: true,
                message: "data found",
                data: results
            })
        })
    }
}

module.exports = IkpController