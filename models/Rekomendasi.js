const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class Rekomendasi {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.rekomendasi.id, ' +
            'db_akreditasi.rekomendasi.survei_id, ' +
            'db_akreditasi.rekomendasi.url_rekomendasi_survei, ' +
            'db_akreditasi.rekomendasi.tanggal_surat_pengajuan_sertifikat '

        const sqlFrom = 'FROM ' +
        'db_akreditasi.rekomendasi ' +
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
        console.log(sql)
        const database = new Database(pool)
        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                console.log(res)
                const results = []
                res.forEach(element => {
                    results.push({
                        id: element['id'],
                        surveiId: element['survei_id'],
                        urlRekomendasiSurvei: element['url_rekomendasi_survei'],
                        tanggalSuratPengajuanSertifikat: dateFormat(element['tanggal_surat_pengajuan_sertifikat'], 'yyyy-mm-dd')
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
            data.surveiId,
            data.urlRekomendasiSurvei,
            data.tanggalSuratPengajuanSertifikat,
            data.userId
        ]

        const sqlInsert = 'INSERT INTO db_akreditasi.rekomendasi ' +
            '(survei_id,url_rekomendasi_survei,tanggal_surat_pengajuan_sertifikat,user_id) ' +
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

module.exports = Rekomendasi