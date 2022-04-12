const survei = require('../models/Survei')
const pagination = require('../configs/Pagination')
const Joi = require('joi')

class SurveiController {
    index(req, res) {
        const surveiObject = new survei()
        surveiObject.getData(req, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if (results.length) {
                const page = parseInt(req.query.page) || 1
                const limit = parseInt(req.query.limit) > 1000 ? 1000 : parseInt(req.query.limit) || 1000
                const paginationObject = new pagination(results, page, limit)
                const remarkPagination = paginationObject.getRemarkPagination()
                const dataPagination = paginationObject.getDataPagination()
                const message = dataPagination.length ? 'data found' : 'data not found'

                res.status(200).send({
                    status: true,
                    message: message,
                    pagination: remarkPagination,
                    data: dataPagination
                })
            } else {
                res.status(200).send({
                    status: true,
                    message: "data not found",
                    data: results
                })
            }
        })
    }

    store(req, res) {
        const schema = Joi.object({
            pengajuanSurveiId: Joi.number().required(),
            tanggalMulai: Joi.string().required(),
            surveior: Joi.array()
                .items(
                    Joi.object().keys({
                        nikSurveior: Joi.string()
                            .min(16)
                            .max(16)
                            .required(),
                        namaSurveior: Joi.string().required()
                    }).required()
                ).required()
        })

        const { error, value } =  schema.validate(req.body)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }
        
        const data = {
            pengajuanSurveiId: req.body.pengajuanSurveiId,
            tanggalMulai: req.body.tanggalMulai,
            userId: req.user.id,
            surveior: req.body.surveior
        }

        const surveiObject = new survei()
        surveiObject.insertData(data, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err.code
                })
                return
            }
            res.status(201).send({
                status: true,
                message: "data inserted successfully",
                data: results
            })
        })
    }
}

module.exports = SurveiController