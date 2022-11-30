const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class Rekomendasi {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.rekomendasi.id, ' +
            'db_akreditasi.rekomendasi.survei_id, ' +
            'db_akreditasi.rekomendasi.url_rekomendasi_survei, ' +
            'db_akreditasi.rekomendasi.tanggal_surat_pengajuan_sertifikat, ' +
            'db_akreditasi.rekomendasi.tanggal_terbit_sertifikat, ' +
            'db_akreditasi.rekomendasi.tanggal_kadaluarsa_sertifikat, ' +
            'db_akreditasi.rekomendasi.capaian_akreditasi_id, ' +
            'db_akreditasi.rekomendasi.no_sertifikat '

        const sqlFrom = 'FROM ' +
        'db_akreditasi.rekomendasi ' +
        'INNER JOIN db_akreditasi.survei ON db_akreditasi.survei.id = db_akreditasi.rekomendasi.survei_id ' +
        'INNER JOIN db_akreditasi.pengajuan_survei ON db_akreditasi.pengajuan_survei.id = db_akreditasi.survei.pengajuan_survei_id '

        const sqlWhere = 'WHERE db_akreditasi.rekomendasi.user_id=? AND '

        const sqlFilterValue = [req.user.id]
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
                        surveiId: element['survei_id'],
                        urlRekomendasiSurvei: element['url_rekomendasi_survei'],
                        tanggalSuratPengajuanSertifikat: dateFormat(element['tanggal_surat_pengajuan_sertifikat'], 'yyyy-mm-dd'),
                        tanggalTerbitSertifikat: dateFormat(element['tanggal_terbit_sertifikat'],'yyyy-mm-dd'),
                        tanggalKadaluarsaSertifikat: dateFormat(element['tanggal_kadaluarsa_sertifikat'],'yyyy-mm-dd'),
                        capaianAkreditasiId: element['capaian_akreditasi_id'],
                        noSertifikat: element['no_sertifikat']
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
            data.tanggalTerbitSertifikat,
            data.tanggalKadaluarsaSertifikat,
            data.capaianAkreditasiId,
            data.noSertifikat,
            data.userId
        ]

        const sqlInsert = 'INSERT INTO db_akreditasi.rekomendasi ' +
            '(survei_id,url_rekomendasi_survei,tanggal_surat_pengajuan_sertifikat,tanggal_terbit_sertifikat,' +
                'tanggal_kadaluarsa_sertifikat,capaian_akreditasi_id,no_sertifikat,user_id) ' +
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

    updateData(data, id, callback) {
        const record = [
            data.surveiId,
            data.urlRekomendasiSurvei,
            data.tanggalSuratPengajuanSertifikat,
            data.tanggalTerbitSertifikat,
            data.tanggalKadaluarsaSertifikat,
            data.capaianAkreditasiId,
            data.noSertifikat,
            data.userId,
            id
        ]

        const sqlUpdate = 'Update db_akreditasi.rekomendasi SET ' +
        'survei_id=?,' +
        'url_rekomendasi_survei=?,' +
        'tanggal_surat_pengajuan_sertifikat=?, ' +
        'tanggal_terbit_sertifikat=?, ' +
        'tanggal_kadaluarsa_sertifikat=?, ' +
        'capaian_akreditasi_id=?, ' +
        'no_sertifikat=? ' + 
        'Where user_id=? And id=?'
        const database = new Database(pool)
        database.query(sqlUpdate, record)
        .then(
            (res) => {
                if (res.affectedRows === 0 && res.changedRows === 0) {
                    callback(null, 'row not matched');
                    return
                }
                let resourceUpdated = {
                    id: id
                } 
                callback(null, resourceUpdated);
            },(error) => {
                throw error
            }
        ).catch((error) => {
            callback(error, null)
        }) 
    }

    deleteData(data, id, callback) {
        const record = [
            data.userId,
            id
        ]

        const sqlDelete = 'Delete From db_akreditasi.rekomendasi ' +
        'Where user_id=? And id=?'
        const database = new Database(pool)
        database.query(sqlDelete, record)
        .then(
            (res) => {
                if (res.affectedRows === 0 && res.changedRows === 0) {
                    callback(null, 'row not matched');
                    return
                }
                let resourceDeleted = {
                    id: id
                } 
                callback(null, resourceDeleted);
            },(error) => {
                throw error
            }
        ).catch((error) => {
            callback(error, null)
        })
    }
}

module.exports = Rekomendasi