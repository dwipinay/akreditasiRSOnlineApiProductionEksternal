const pagination = require('../configs/Pagination')
const Joi = require('joi')
const penilaianBab = require('../models/PenilaianBab')

class PenilaianBabController {
    index(req, res) {
        const penilaianBabObject = new penilaianBab()
        penilaianBabObject.getData(req, (err, results) => {
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
            rekomendasiId: Joi.number().required(),
            penilaianBab: Joi.array()
                .items(
                    Joi.object().keys({
                        babId: Joi.number().required(),
                        nilai: Joi.number().precision(2).required()
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
            rekomendasiId: req.body.rekomendasiId,
            userId: req.user.id,
            penilaianBab: req.body.penilaianBab
        }

        const penilaianBabObject = new penilaianBab()
        penilaianBabObject.insertData(data, (err, results) => {
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

    update(req, res) {
        const schema = Joi.object({
            babId: Joi.number().required(),
            nilai: Joi.number().precision(2).required()
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
            babId: req.body.babId,
            nilai: req.body.nilai,
            userId: req.user.id
        }

        const penilaianBabObject = new penilaianBab()
        penilaianBabObject.updateData(data, req.params.id, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: {
                        code: err.code,
                        errno: err
                    }
                })
                return
            }
            if (result == 'row not matched') {
                res.status(404).send({
                    status: false,
                    message: 'data not found'
                })
                return
            }
            res.status(200).send({
                status: true,
                message: "data updated successfully",
                data: result
            })
        })
    }

    delete(req, res) {
        const data = {
            userId: req.user.id
        }

        const penilaianBabObject = new penilaianBab()
        penilaianBabObject.deleteData(data, req.params.id, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: {
                        code: err.code,
                        errno: err.errno
                    }
                })
                return
            }
            if (result == 'row not matched') {
                res.status(404).send({
                    status: false,
                    message: 'data not found'
                })
                return
            }
            res.status(200).send({
                status: true,
                message: "data deleted successfully",
                data: result
            })
        })
    }
}

module.exports = PenilaianBabController