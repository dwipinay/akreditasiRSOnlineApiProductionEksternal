class Database {
    constructor(pool) {
        this.pool = pool
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    // console.log(err)
                    return reject(err)
                }
                connection.query(sql, args, (error, results) => {
                    connection.release()
                    if (error) {
                        return reject(error)
                    }
                    // console.log(this.pool._freeConnections.length)
                    resolve(results)
                })
            })
        })
    }
}

module.exports = Database