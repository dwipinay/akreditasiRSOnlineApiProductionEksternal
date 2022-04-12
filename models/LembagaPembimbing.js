const pool = require('../configs/pool')
const Database = require('./Database')

class LembagaPembimbing {
    getAll(req, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'db_akreditasi.lembaga_pembimbing.id, '+ 
        'db_akreditasi.lembaga_pembimbing.nama ' +
        'FROM db_akreditasi.lembaga_pembimbing ' +
        'ORDER BY db_akreditasi.lembaga_pembimbing.id'

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

module.exports = LembagaPembimbing