const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class PengajuaanSurvei {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.pengajuan_survei.id, ' +
            'db_akreditasi.pengajuan_survei.kode_rs, ' +
            'db_akreditasi.pengajuan_survei.lembaga_akreditasi_id, ' +
            'db_akreditasi.pengajuan_survei.tanggal_pengajuan_survei '

        const sqlFrom = 'FROM ' +
            'db_akreditasi.pengajuan_survei '

        const sqlWhere = 'WHERE db_akreditasi.pengajuan_survei.user_id=? AND '

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
                        kodeRS: element['kode_rs'],
                        lembagaAkreditasiId: element['lembaga_akreditasi_id'],
                        tanggalPengajuanSurvei: dateFormat(element['tanggal_pengajuan_survei'],'yyyy-mm-dd')
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
            data.kodeRS,
            data.lembagaAkreditasiId,
            data.tanggalPengajuanSurvei,
            data.userId
        ]

        const sqlInsert = 'INSERT INTO db_akreditasi.pengajuan_survei ' +
            '(kode_rs,lembaga_akreditasi_id,tanggal_pengajuan_survei,user_id) ' +
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
            data.kodeRS,
            data.lembagaAkreditasiId,
            data.tanggalPengajuanSurvei,
            data.userId,
            id
        ]
        
        const sqlUpdate = 'Update db_akreditasi.pengajuan_survei SET ' +
        'kode_rs=?,' +
        'lembaga_akreditasi_id=?,' +
        'tanggal_pengajuan_survei=? ' +
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

        const sqlDelete = 'Delete From db_akreditasi.pengajuan_survei ' +
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

module.exports = PengajuaanSurvei