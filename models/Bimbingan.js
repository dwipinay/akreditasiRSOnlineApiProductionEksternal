const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class Bimbingan {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.bimbingan.id, ' +
            'db_akreditasi.bimbingan.lembaga_pembimbing_id, ' +
            'db_akreditasi.bimbingan.tanggal_mulai, ' +
            'db_akreditasi.bimbingan.tanggal_selesai, ' +
            'db_akreditasi.bimbingan_detail.nik_pembimbing, ' +
            'db_akreditasi.bimbingan_detail.nama_pembimbing '

        const sqlFrom = 'FROM ' +
            'db_akreditasi.bimbingan ' +
            'INNER JOIN db_akreditasi.bimbingan_detail ON db_akreditasi.bimbingan_detail.bimbingan_id = db_akreditasi.bimbingan.id '

        const sqlWhere = 'WHERE '

        const sqlFilterValue = []
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
                                    nikPembimbing: element2['nik_pembimbing'],
                                    namaPembimbing: element2['nama_pembimbing']
                                })
                            }
                        })

                        results.push({
                            id: element['id'],
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
                            function (err, uResults) {
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
                                            uResults.insertId,
                                            data.pembimbing[i].nikPembimbing,
                                            data.pembimbing[i].namaPembimbing
                                        ])
                                    }
                                    
                                    const sqlInsertDetail = 'INSERT INTO db_akreditasi.bimbingan_detail ' +
                                    '(bimbingan_id,nik_pembimbing,nama_pembimbing) ' +
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

module.exports = Bimbingan