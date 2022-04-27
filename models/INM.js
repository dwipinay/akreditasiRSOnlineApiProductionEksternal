const axios = require('axios')

class Inm {
    getData(req, callback) {
        const endPoint = 'http://mutufasyankes.kemkes.go.id/simar/sinar'
        const config = {
            headers: {
                'kode_rs': req.query.kodeRS,
                'tahun': req.query.tahun,
                'bulan': req.query.bulan,
                'token': 'f034d13c29e1935c9f83a8cdc9863c94dffad837e640cc28b8e5c1875cd768c8'
            }
        }
        const payLoad = {}
        axios.post(endPoint, payLoad, config)
        .then(
            (res) => {
                callback(null, res.data.data_capaian_inm)
            }
        )
        .catch(
            (error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = Inm