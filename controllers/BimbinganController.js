const bimbingan = require('../models/Bimbingan')
const pagination = require('../configs/Pagination')
const Joi = require('joi')

class BimbinganController {
    index(req, res) {
        const bimbinganObject = new bimbingan()
        bimbinganObject.getData(req, (err, results) => {
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
            kodeRS: Joi.number().required(),
            lembagaPembimbingId: Joi.number().required(),
            tanggalMulai: Joi.string().required(),
            tanggalSelesai: Joi.string().required(),
            pembimbing: Joi.array()
                .items(
                    Joi.object().keys({
                        nikPembimbing: Joi.string()
                            .min(16)
                            .max(16)
                            .required(),
                        namaPembimbing: Joi.string().required()
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
            kodeRS: req.body.kodeRS,
            lembagaPembimbingId: req.body.lembagaPembimbingId,
            tanggalMulai: req.body.tanggalMulai,
            tanggalSelesai: req.body.tanggalSelesai,
            userId: req.user.id,
            pembimbing: req.body.pembimbing
        }

        const bimbinganObject = new bimbingan()
        bimbinganObject.insertData(data, (err, results) => {
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
            kodeRS: Joi.number().required(),
            lembagaPembimbingId: Joi.number().required(),
            tanggalMulai: Joi.string().required(),
            tanggalSelesai: Joi.string().required(),
            pembimbing:
                Joi.object().keys({
                    id: Joi.number().required(),
                    nikPembimbing: Joi.string()
                        .min(16)
                        .max(16)
                        .required(),
                    namaPembimbing: Joi.string().required()
                }).required().allow(null)
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
            kodeRS: req.body.kodeRS,
            lembagaPembimbingId: req.body.lembagaPembimbingId,
            tanggalMulai: req.body.tanggalMulai,
            tanggalSelesai: req.body.tanggalSelesai,
            userId: req.user.id,
            pembimbing: req.body.pembimbing
        }

        const pembimbingObject = new bimbingan()
        pembimbingObject.updateData(data, req.params.id, (err, result) => {
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
                message: "data updated successfully",
                data: result
            })
        })
    }

    delete(req, res) {
        const data = {
            userId: req.user.id
        }

        const bimbinganObject = new bimbingan()
        bimbinganObject.deleteData(data, req.params.id, (err, result) => {
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

module.exports = BimbinganController