const inm = require('../models/INM')
const Joi = require('joi')

class InmController {
    index(req, res) {
        const inmObject = new inm()
        inmObject.getData(req, (err, results) => {
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

module.exports = InmController