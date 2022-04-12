const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class Survei {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.survei.id, ' +
            'db_akreditasi.survei.pengajuan_survei_id, ' +
            'db_akreditasi.survei.tanggal_mulai, ' +
            'db_akreditasi.survei_detail.nik_surveior, ' +
            'db_akreditasi.survei_detail.nama_surveior '

        const sqlFrom = 'FROM ' +
            'db_akreditasi.survei ' +
            'INNER JOIN db_akreditasi.pengajuan_survei ON db_akreditasi.pengajuan_survei.id = db_akreditasi.survei.pengajuan_survei_id ' +
            'INNER JOIN db_akreditasi.survei_detail ON db_akreditasi.survei_detail.survei_id = db_akreditasi.survei.id '

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
                let surveior = []
                let id = null
                res.forEach(element => {
                    if (id != element['id']) {
                        res.forEach(element2 => {
                            if (element['id'] == element2['id']) {
                                surveior.push({
                                    nikSurveior: element2['nik_surveior'],
                                    namaSurveior: element2['nama_surveior']
                                })
                            }
                        })

                        results.push({
                            id: element['id'],
                            pengajuanSurveiId: element['pengajuan_survei_id'],
                            tanggalMulai: dateFormat(element['tanggal_mulai'], 'yyyy-dd-mm'),
                            surveior: surveior
                        })

                        surveior = []
                        id = element['id']
                    }
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
        this.insertScript (data)
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

    insertScript(data) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                connection.beginTransaction(function (err) {
                    if (err) {
                        //Transaction Error (Rollback and release connection)
                        connection.rollback(function () {
                            connection.release();
                        });
                        return reject(err);
                    } else {
                        const recordHeader = [
                            data.pengajuanSurveiId,
                            data.tanggalMulai,
                            data.userId
                        ]
                
                        const sqlInsertHeader = 'INSERT INTO db_akreditasi.survei ' +
                            '(pengajuan_survei_id,tanggal_mulai,user_id) ' +
                            'VALUES ( ? )'

                        connection.query(
                            sqlInsertHeader, 
                            [recordHeader],
                            function (err, uResults) {
                                if (err) {
                                    //Query Error (Rollback and release connection)
                                    connection.rollback(function () {
                                        connection.release();
                                    });
                                    return reject(err);
                                } else {
                                    
                                    let recordDetails = []
                                    for (let i in data.surveior) {
                                        recordDetails.push([
                                            uResults.insertId,
                                            data.surveior[i].nikSurveior,
                                            data.surveior[i].namaSurveior
                                        ])
                                    }
                                    
                                    const sqlInsertDetail = 'INSERT INTO db_akreditasi.survei_detail ' +
                                    '(survei_id,nik_surveior,nama_surveior) ' +
                                    'VALUES ? '

                                    connection.query(
                                        sqlInsertDetail,
                                        [recordDetails],
                                        function(err, results) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    connection.release()
                                                })
                                                return reject(err)
                                            } else {
                                                connection.commit(function (err) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            connection.release()
                                                        })
                                                        return reject(err)
                                                    } else {
                                                        connection.release()
                                                        return resolve(uResults);
                                                    }
                                                })
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                })
            })
        })
    }
}

module.exports = Survei