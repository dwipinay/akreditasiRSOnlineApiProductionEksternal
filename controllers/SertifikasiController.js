const sertifikasi = require('../models/Sertifikasi')
const pagination = require('../configs/Pagination')
const Joi = require('joi')

class SertifikasiController {
    index(req, res) {
        const sertifikasiObject = new sertifikasi()
        sertifikasiObject.getData(req, (err, results) => {
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
            urlSertifikatAkreditasi: Joi.string().required(), 
            tanggalTerbit: Joi.string().required(),
            tanggalKadaluarsa: Joi.string().required(),
            capaianAkreditasiId: Joi.number().required()
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
            urlSertifikatAkreditasi: req.body.urlSertifikatAkreditasi, 
            tanggalTerbit: req.body.tanggalTerbit,
            tanggalKadaluarsa: req.body.tanggalKadaluarsa,
            capaianAkreditasiId: req.body.capaianAkreditasiId,
            userId: req.user.id
        }

        const sertifikasiObject = new sertifikasi()
        sertifikasiObject.insertData(data, (err, results) => {
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

module.exports = SertifikasiController