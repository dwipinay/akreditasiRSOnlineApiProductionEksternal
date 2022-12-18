const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')
const { array } = require('joi')

class PenilaianBab {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.penilaian_bab.id, ' +
            'db_akreditasi.penilaian_bab.bab_id, ' +
            'db_akreditasi.penilaian_bab.nilai ' 

        const sqlFrom = 'FROM ' +
        'db_akreditasi.penilaian_bab ' +
        'INNER JOIN db_akreditasi.rekomendasi ON db_akreditasi.rekomendasi.id = db_akreditasi.penilaian_bab.rekomendasi_id ' +
        'INNER JOIN db_akreditasi.survei ON db_akreditasi.survei.id = db_akreditasi.rekomendasi.survei_id ' +
        'INNER JOIN db_akreditasi.pengajuan_survei ON db_akreditasi.pengajuan_survei.id = db_akreditasi.survei.pengajuan_survei_id '

        const sqlWhere = 'WHERE db_akreditasi.penilaian_bab.user_id=? '

        const sqlFilterValue = [req.user.id]
        const filter = []

        const rekomendasiId = req.query.rekomendasiId || null
        if (rekomendasiId != null) {
            filter.push('AND db_akreditasi.penilaian_bab.rekomendasi_id = ?')
            sqlFilterValue.push(rekomendasiId)
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
                        babId: element['bab_id'],
                        nilai: element['nilai']
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
        let record = []
        for (let i in data.penilaianBab) {
            record.push([
                data.rekomendasiId,
                data.penilaianBab[i].babId,
                data.penilaianBab[i].nilai,
                data.userId
            ])
        }
        
        const sqlInsert = 'INSERT INTO db_akreditasi.penilaian_bab ' +
            '(rekomendasi_id,bab_id,nilai,user_id) ' +
            'VALUES ? '
        
        const database = new Database(pool)
        database.query(sqlInsert, [record])
        .then(
            (res) => {
                let iteration = 0
                let dataDetail = []
                for(let i = res.insertId; i < res.insertId + res.affectedRows; i++) {
                    dataDetail.push({
                        id: i,
                        babId: data.penilaianBab[iteration].babId,
                        nilai: data.penilaianBab[iteration].nilai,
                    })
                    iteration += 1
                }
                let dataInserted = {
                    rekomendasiId: data.rekomendasiId,
                    penilaianBab: dataDetail
                }
                callback(null, dataInserted )
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
            data.babId,
            data.nilai,
            data.userId,
            id
        ]

        const sqlUpdate = 'Update db_akreditasi.penilaian_bab SET ' +
        'bab_id=?,' +
        'nilai=? ' +
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

        const sqlDelete = 'Delete From db_akreditasi.penilaian_bab ' +
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

module.exports = PenilaianBab