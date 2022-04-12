const pool = require('../configs/pool')
const Database = require('./Database')

class LembagaAkreditasi {
    getAll(req, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'db_akreditasi.lembaga_akreditasi.id, '+ 
        'db_akreditasi.lembaga_akreditasi.nama ' +
        'FROM db_akreditasi.lembaga_akreditasi ' +
        'ORDER BY db_akreditasi.lembaga_akreditasi.id'

        database.query(sql)
        .then(
            (res) => {
                callback(null, res)
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = LembagaAkreditasi