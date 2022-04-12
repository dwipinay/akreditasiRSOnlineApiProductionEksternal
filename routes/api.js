const express = require('express')
const router = express.Router()

const userToken = require('../configs/UserToken')
const userCredentialController = require('../controllers/UserCredentialController')
const userIPController = require('../controllers/UserIPController')
const pengajuaanSurveiController = require('../controllers/PengajuanSurveiController')
const bimbinganController = require('../controllers/BimbinganController')
const surveiController = require('../controllers/SurveiController')
const rekomendasiController = require('../controllers/RekomendasiController')
const sertifikasiController = require('../controllers/SertifikasiController')
const lembagaAkreditasiController = require('../controllers/LembagaAkreditasiController')
const lembagaPembimbingController = require('../controllers/LembagaPembimbingController')
const CapaianAkreditasiController = require('../controllers/CapaianAkreditasiController')

const userTokenObject = new userToken()
const userCredentialControllerObject = new userCredentialController()
const userIPControllerObject = new userIPController()
const pengajuaanSurveiControllerObject = new pengajuaanSurveiController()
const bimbinganControllerObject = new bimbinganController()
const surveiControllerObject = new surveiController()
const rekomendasiControllerObject = new rekomendasiController()
const sertifikasiControllerObject = new sertifikasiController()
const lembagaAkreditasiControllerObject = new lembagaAkreditasiController()
const lembagaPembimbingControllerObject = new lembagaPembimbingController()
const capaianAkreditasiControllerObject = new CapaianAkreditasiController()

router.post('/api/login', 
    userIPControllerObject.authenticateIP,
    userCredentialControllerObject.authenticateCredentialNonFasyankes)

// Pengajuan Survei
router.post('/api/pengajuansurvei',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    pengajuaanSurveiControllerObject.store
)
router.get('/api/pengajuansurvei',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    pengajuaanSurveiControllerObject.index
)

// Bimbingan
router.post('/api/bimbingan',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    bimbinganControllerObject.store
)
router.get('/api/bimbingan',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    bimbinganControllerObject.index
)

// Survei
router.post('/api/survei',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    surveiControllerObject.store
)
router.get('/api/survei',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    surveiControllerObject.index
)

// Rekomendasi
router.post('/api/rekomendasi',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    rekomendasiControllerObject.store
)
router.get('/api/rekomendasi',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    rekomendasiControllerObject.index
)

// Sertifikasi
router.post('/api/sertifikasi',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    sertifikasiControllerObject.store
)

router.get('/api/sertifikasi',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    sertifikasiControllerObject.index
)

router.get('/api/lembagaakreditasi',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    lembagaAkreditasiControllerObject.index
)

router.get('/api/lembagapembimbing',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    lembagaPembimbingControllerObject.index
)

router.get('/api/capaianakreditasi',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    capaianAkreditasiControllerObject.index
)


router.use('/api', (req, res) => {
    res.status(404).send({
        status: false,
        message: 'page not found'
    });
})

module.exports = router