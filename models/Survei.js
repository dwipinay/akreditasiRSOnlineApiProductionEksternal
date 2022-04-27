const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')
const { array } = require('joi')

class Survei {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.survei.id, ' +
            'db_akreditasi.survei.pengajuan_survei_id, ' +
            'db_akreditasi.survei.tanggal_mulai, ' +
            'db_akreditasi.survei_detail.id as surveior_id, ' +
            'db_akreditasi.survei_detail.nik_surveior, ' +
            'db_akreditasi.survei_detail.nama_surveior '

        const sqlFrom = 'FROM ' +
            'db_akreditasi.survei ' +
            'INNER JOIN db_akreditasi.pengajuan_survei ON db_akreditasi.pengajuan_survei.id = db_akreditasi.survei.pengajuan_survei_id ' +
            'INNER JOIN db_akreditasi.survei_detail ON db_akreditasi.survei_detail.survei_id = db_akreditasi.survei.id '

        const sqlWhere = 'WHERE db_akreditasi.survei.user_id=? AND '

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
                let surveior = []
                let id = null
                res.forEach(element => {
                    if (id != element['id']) {
                        res.forEach(element2 => {
                            if (element['id'] == element2['id']) {
                                surveior.push({
                                    id: element2['surveior_id'],
                                    nikSurveior: element2['nik_surveior'],
                                    namaSurveior: element2['nama_surveior']
                                })
                            }
                        })

                        results.push({
                            id: element['id'],
                            pengajuanSurveiId: element['pengajuan_survei_id'],
                            tanggalMulai: dateFormat(element['tanggal_mulai'], 'yyyy-mm-dd'),
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
        this.insertScript(data)
        .then(
            (res) => {
                let iteration = 0
                let dataDetail = []
                for(let i = res[1].insertId; i < res[1].insertId + res[1].affectedRows; i++) {
                    dataDetail.push({
                        id: i,
                        nikSurveior: data.surveior[iteration].nikSurveior
                    })
                    iteration += 1
                }
                let dataInserted = {
                    id: res[0].insertId,
                    surveior: dataDetail
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
                            function (err, resultHeader) {
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
                                            resultHeader.insertId,
                                            data.surveior[i].nikSurveior,
                                            data.surveior[i].namaSurveior,
                                            data.userId
                                        ])
                                    }
                                    
                                    const sqlInsertDetail = 'INSERT INTO db_akreditasi.survei_detail ' +
                                    '(survei_id,nik_surveior,nama_surveior,user_id) ' +
                                    'VALUES ? '

                                    connection.query(
                                        sqlInsertDetail,
                                        [recordDetails],
                                        function(err, resultDetail) {
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
                                                        const results = [
                                                            resultHeader,
                                                            resultDetail
                                                        ]
                                                        return resolve(results);
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

    updateData(data, id, callback) {
        this.updateScript(data, id)
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
            }
        )
        .catch((error) => {
            callback(error, null)
        })
    }

    updateScript(data, id) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    return reject(err);
                }
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
                            data.userId,
                            id
                        ]
                        const sqlUpdateHeader = 'Update db_akreditasi.survei SET ' +
                        'pengajuan_survei_id=?,' +
                        'tanggal_mulai=? ' +
                        'Where user_id=? And id=?'
                        connection.query(
                            sqlUpdateHeader, 
                            recordHeader,
                            function (err, resultHeader) {
                                if (err) {
                                    //Query Error (Rollback and release connection)
                                    connection.rollback(function () {
                                        connection.release();
                                    });
                                    return reject(err);
                                } else {
                                    if (data.surveior == null) {
                                        connection.commit(function (err) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    connection.release()
                                                })
                                                return reject(err)
                                            } else {
                                                connection.release()
                                                return resolve(resultHeader);
                                            }
                                        })
                                        return
                                    }
                                    const recordDetail = [
                                        data.surveior.nikSurveior,
                                        data.surveior.namaSurveior,
                                        data.userId,
                                        data.surveior.id,
                                        id
                                    ]
                                    const sqlUpdateDetail = 'Update db_akreditasi.survei_detail SET ' +
                                    'nik_surveior=?,' +
                                    'nama_surveior=? ' +
                                    'Where user_id=? And id=? And survei_id=?'
                                    connection.query(
                                        sqlUpdateDetail,
                                        recordDetail,
                                        function (err, resultDetail) {
                                            if (err) {
                                                //Query Error (Rollback and release connection)
                                                connection.rollback(function () {
                                                    connection.release();
                                                });
                                                return reject(err);
                                            } else {
                                                connection.commit(function (err) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            connection.release()
                                                        })
                                                        return reject(err)
                                                    } else {
                                                        connection.release()
                                                        return resolve(resultHeader);
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

    deleteData(data, id, callback) {
        this.deleteScript(data, id)
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
            }
        )
        .catch((error) => {
            callback(error, null)
        })
    }

    deleteScript(data, id) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    return reject(err);
                }
                connection.beginTransaction(function (err) {
                    if (err) {
                        //Transaction Error (Rollback and release connection)
                        connection.rollback(function () {
                            connection.release();
                        });
                        return reject(err);
                    } else {
                        const recordDetail = [
                            data.userId,
                            id
                        ]
                        const sqlDeleteDetail = 'Delete From db_akreditasi.survei_detail ' +
                        'Where user_id=? And survei_id=?'
                        connection.query(
                            sqlDeleteDetail, 
                            recordDetail,
                            function (err, resultHeader) {
                                if (err) {
                                    //Query Error (Rollback and release connection)
                                    connection.rollback(function () {
                                        connection.release();
                                    });
                                    return reject(err);
                                } else {
                                    const recordHeader = [
                                        data.userId,
                                        id
                                    ]
                                    const sqlDeleteHeader = 'Delete From db_akreditasi.survei ' +
                                    'Where user_id=? And id=?'
                                    connection.query(
                                        sqlDeleteHeader,
                                        recordHeader,
                                        function (err, resultHeader) {
                                            if (err) {
                                                //Query Error (Rollback and release connection)
                                                connection.rollback(function () {
                                                    connection.release();
                                                });
                                                return reject(err);
                                            } else {
                                                connection.commit(function (err) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            connection.release()
                                                        })
                                                        return reject(err)
                                                    } else {
                                                        connection.release()
                                                        return resolve(resultHeader);
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