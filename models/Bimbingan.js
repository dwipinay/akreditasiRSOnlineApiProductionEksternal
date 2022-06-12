const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class Bimbingan {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.bimbingan.id, ' +
            'db_akreditasi.bimbingan.kode_rs, ' +
            'db_akreditasi.bimbingan.lembaga_pembimbing_id, ' +
            'db_akreditasi.bimbingan.tanggal_mulai, ' +
            'db_akreditasi.bimbingan.tanggal_selesai, ' +
            'db_akreditasi.bimbingan_detail.id as id_pembimbing, ' +
            'db_akreditasi.bimbingan_detail.nik_pembimbing, ' +
            'db_akreditasi.bimbingan_detail.nama_pembimbing '

        const sqlFrom = 'FROM ' +
            'db_akreditasi.bimbingan ' +
            'INNER JOIN db_akreditasi.bimbingan_detail ON db_akreditasi.bimbingan_detail.bimbingan_id = db_akreditasi.bimbingan.id '

        const sqlWhere = 'WHERE db_akreditasi.bimbingan.user_id=? AND '

        const sqlFilterValue = [req.user.id]
        const filter = []

        const kodeRS = req.query.kodeRS || null
        if (kodeRS != null) {
            filter.push('db_akreditasi.bimbingan.kode_rs = ?')
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
                let pembimbing = []
                let id = null
                res.forEach(element => {
                    if (id != element['id']) {
                        res.forEach(element2 => {
                            if (element['id'] == element2['id']) {
                                pembimbing.push({
                                    id: element2['id_pembimbing'],
                                    nikPembimbing: element2['nik_pembimbing'],
                                    namaPembimbing: element2['nama_pembimbing']
                                })
                            }
                        })

                        results.push({
                            id: element['id'],
                            kodeRS: element['kode_rs'],
                            lembagaPembimbingId: element['lembaga_pembimbing_id'],
                            tanggalMulai: dateFormat(element['tanggal_mulai'], 'yyyy-dd-mm'),
                            tanggalSelesai: dateFormat(element['tanggal_selesai'], 'yyyy-dd-mm'),
                            pembimbing: pembimbing
                        })

                        pembimbing = []
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
                let iteration = 0
                let dataDetail = []
                for(let i = res[1].insertId; i < res[1].insertId + res[1].affectedRows; i++) {
                    dataDetail.push({
                        id: i,
                        nikPembimbing: data.pembimbing[iteration].nikPembimbing
                    })
                    iteration += 1
                }
                let dataInserted = {
                    id: res[0].insertId,
                    pembimbing: dataDetail
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
                            data.kodeRS,
                            data.lembagaPembimbingId,
                            data.tanggalMulai,
                            data.tanggalSelesai,
                            data.userId
                        ]
                
                        const sqlInsertHeader = 'INSERT INTO db_akreditasi.bimbingan ' +
                            '(kode_rs,lembaga_pembimbing_id,tanggal_mulai,tanggal_selesai,user_id) ' +
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
                                    for (let i in data.pembimbing) {
                                        recordDetails.push([
                                            resultHeader.insertId,
                                            data.pembimbing[i].nikPembimbing,
                                            data.pembimbing[i].namaPembimbing,
                                            data.userId
                                        ])
                                    }
                                    
                                    const sqlInsertDetail = 'INSERT INTO db_akreditasi.bimbingan_detail ' +
                                    '(bimbingan_id,nik_pembimbing,nama_pembimbing,user_id) ' +
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
                            data.kodeRS,
                            data.lembagaPembimbingId,
                            data.tanggalMulai,
                            data.tanggalSelesai,
                            data.userId,
                            id
                        ]
                        const sqlUpdateHeader = 'Update db_akreditasi.bimbingan SET ' +
                        'kode_rs=?,' +
                        'lembaga_pembimbing_id=?,' +
                        'tanggal_mulai=?, ' +
                        'tanggal_selesai=? ' +
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
                                    if (data.pembimbing == null) {
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

                                    let values = []
                                    data.pembimbing.forEach(element => {
                                        values.push([
                                            element['nikPembimbing'],
                                            element['namaPembimbing'],
                                            data.userId,
                                            element['id'],
                                            id
                                        ])
                                    })

                                    values.forEach((item, index) => {
                                        connection.query('Update db_akreditasi.bimbingan_detail SET ' +
                                        'nik_pembimbing=?,' +
                                        'nama_pembimbing=? ' +
                                        'Where user_id=? And id=? And bimbingan_id=?', item, function(err, result){
                                            if (err) {
                                                console.log('error')
                                                //Query Error (Rollback and release connection)
                                                connection.rollback(function () {
                                                    connection.release();
                                                });
                                                return reject(err);
                                            } else {
                                                if (index == values.length - 1) {
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
                                        }) 
                                    })
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
                        const sqlDeleteDetail = 'Delete From db_akreditasi.bimbingan_detail ' +
                        'Where user_id=? And bimbingan_id=?'
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
                                    const sqlDeleteHeader = 'Delete From db_akreditasi.bimbingan ' +
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

module.exports = Bimbingan