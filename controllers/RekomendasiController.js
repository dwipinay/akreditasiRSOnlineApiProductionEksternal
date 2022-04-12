const rekomendasi = require('../models/Rekomendasi')
const pagination = require('../configs/Pagination')
const Joi = require('joi')

class RekomendasiController {
    index(req, res) {
        const rekomendasiObject = new rekomendasi()
        rekomendasiObject.getData(req, (err, results) => {
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
            surveiId: Joi.number().required(),
            urlRekomendasiSurvei: Joi.string().required(), 
            tanggalSuratPengajuanSertifikat: Joi.string().required()
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
            surveiId: req.body.surveiId,
            urlRekomendasiSurvei: req.body.urlRekomendasiSurvei,
            tanggalSuratPengajuanSertifikat: req.body.tanggalSuratPengajuanSertifikat,
            userId: req.user.id
        }

        const rekomendasiObject = new rekomendasi()
        rekomendasiObject.insertData(data, (err, results) => {
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

module.exports = RekomendasiController