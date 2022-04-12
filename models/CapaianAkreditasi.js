const pool = require('../configs/pool')
const Database = require('./Database')

class CapaianAkreditasi {
    getAll(req, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'db_akreditasi.capaian_akreditasi.id, '+ 
        'db_akreditasi.capaian_akreditasi.nama ' +
        'FROM db_akreditasi.capaian_akreditasi ' +
        'ORDER BY db_akreditasi.capaian_akreditasi.id'

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

module.exports = CapaianAkreditasi