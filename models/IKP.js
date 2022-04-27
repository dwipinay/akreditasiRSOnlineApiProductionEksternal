const axios = require('axios')

class Ikp {
    getData(req, callback) {
        const endPoint = 'https://mutufasyankes.kemkes.go.id/api/status_ikp/'.concat(req.query.kodeRS)
        const timeStamp = Date.now()
        const config = {
            headers: {
                'X-Id': 'mutukemenkes',
                'X-Pass': 'rsonline!@#$',
                'X-Timestamp': timeStamp
            }
        }
        axios.get(endPoint, config)
        .then(
            (res) => {
                callback(null, res.data)
            }
        )
        .catch(
            (error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = Ikp