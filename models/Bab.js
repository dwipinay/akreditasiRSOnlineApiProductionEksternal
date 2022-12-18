const pool = require('../configs/pool')
const Database = require('./Database')

class Bab {
    getData(req, callback) {
        const sqlSelect = 'SELECT ' +
            'db_akreditasi.bab.id, ' +
            'db_akreditasi.bab.nama '

        const sqlFrom = 'FROM ' +
            'db_akreditasi.bab ' 

        const sql = sqlSelect.concat(sqlFrom)

        const database = new Database(pool)
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
        })
    }
    
    
}

module.exports = Bab