const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class Sertifikasi {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.sertifikasi.id, ' +
            'db_akreditasi.sertifikasi.rekomendasi_id, ' +
            'db_akreditasi.sertifikasi.url_sertifikat_akreditasi, ' +
            'db_akreditasi.sertifikasi.tanggal_terbit, ' +
            'db_akreditasi.sertifikasi.tanggal_kadaluarsa, ' +
            'db_akreditasi.sertifikasi.capaian_akreditasi_id '

        const sqlFrom = 'FROM ' +
            'db_akreditasi.sertifikasi ' +
            'INNER JOIN db_akreditasi.rekomendasi ON db_akreditasi.rekomendasi.id = db_akreditasi.sertifikasi.rekomendasi_id ' +
            'INNER JOIN db_akreditasi.survei ON db_akreditasi.survei.id = db_akreditasi.rekomendasi.survei_id ' +
            'INNER JOIN db_akreditasi.pengajuan_survei ON db_akreditasi.pengajuan_survei.id = db_akreditasi.survei.pengajuan_survei_id '

        const sqlWhere = 'WHERE '

        const sqlFilterValue = []
        const filter = []

        const kodeRS = req.query.kodeRS || null
        if (kodeRS != null) {
            filter.push('db_akreditasi.pengajuan_survei.kode_rs = ?')
            sqlFilterValue.push(kodeRS)
        }

        let sqlFilter = ''
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index > 0) {
                sqlFilter = sqlFilter.concat(' AND ').concat(value)
            }
        })
        
        const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter)

        const database = new Database(pool)
        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                const results = []
                res.forEach(element => {
                    results.push({
                        id: element['id'],
                        rekomendasiId: element['rekomendasi_id'],
                        urlSertifikatSurvei: element['url_sertifikat_akreditasi'],
                        tanggalTerbit: dateFormat(element['tanggal_terbit'], 'yyyy-mm-dd'),
                        tanggalKadaluarsa: dateFormat(element['tanggal_kadaluarsa'], 'yyyy-mm-dd'),
                        capaianAkreditasiId: element['capaian_akreditasi_id']
                    })
                })
                callback(null, results)
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
            callback(error, null)
        })
    }

    insertData(data, callback) {
        const record = [
            data.rekomendasiId,
            data.urlSertifikatAkreditasi,
            data.tanggalTerbit,
            data.tanggalKadaluarsa,
            data.capaianAkreditasiId,
            data.userId
        ]

        const sqlInsert = 'INSERT INTO db_akreditasi.sertifikasi ' +
            '(rekomendasi_id,url_sertifikat_akreditasi,tanggal_terbit,tanggal_kadaluarsa,capaian_akreditasi_id,user_id) ' +
            'VALUES ( ? )'

        const database = new Database(pool)
        database.query(sqlInsert, [record])
        .then(
            (res) => {
                let dataInserted = {
                    id: res.insertId
                }
                callback(null, dataInserted)
            }, (error) => {
                throw error
            }
        )
        .catch((error) => {
            callback(error, null)
        })  
    }
}

module.exports = Sertifikasi