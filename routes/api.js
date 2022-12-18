const express = require('express')
const router = express.Router()

const userToken = require('../configs/UserToken')
const userCredentialController = require('../controllers/UserCredentialController')
const userIPController = require('../controllers/UserIPController')
const pengajuaanSurveiController = require('../controllers/PengajuanSurveiController')
const bimbinganController = require('../controllers/BimbinganController')
const surveiController = require('../controllers/SurveiController')
const rekomendasiController = require('../controllers/RekomendasiController')
const penilaianBabController = require('../controllers/PenilaianBabController')
const sertifikasiController = require('../controllers/SertifikasiController')
const lembagaAkreditasiController = require('../controllers/LembagaAkreditasiController')
const lembagaPembimbingController = require('../controllers/LembagaPembimbingController')
const CapaianAkreditasiController = require('../controllers/CapaianAkreditasiController')
const inmController = require('../controllers/INMController')
const ikpController = require('../controllers/IKPController')
const BabController = require('../controllers/BabController')

const userTokenObject = new userToken()
const userCredentialControllerObject = new userCredentialController()
const userIPControllerObject = new userIPController()
const pengajuaanSurveiControllerObject = new pengajuaanSurveiController()
const bimbinganControllerObject = new bimbinganController()
const surveiControllerObject = new surveiController()
const rekomendasiControllerObject = new rekomendasiController()
const penilaianBabControllerObject = new penilaianBabController()
const sertifikasiControllerObject = new sertifikasiController()
const lembagaAkreditasiControllerObject = new lembagaAkreditasiController()
const lembagaPembimbingControllerObject = new lembagaPembimbingController()
const capaianAkreditasiControllerObject = new CapaianAkreditasiController()
const ikpControllerObject = new ikpController()
const inmControllerObject = new inmController()
const BabControllerObject = new BabController()

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
router.patch('/api/pengajuansurvei/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    pengajuaanSurveiControllerObject.update
)
router.delete('/api/pengajuansurvei/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    pengajuaanSurveiControllerObject.delete
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
router.patch('/api/bimbingan/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    bimbinganControllerObject.update
)
router.delete('/api/bimbingan/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    bimbinganControllerObject.delete
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
router.patch('/api/survei/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    surveiControllerObject.update
)
router.delete('/api/survei/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    surveiControllerObject.delete
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
router.patch('/api/rekomendasi/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    rekomendasiControllerObject.update
)
router.delete('/api/rekomendasi/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    rekomendasiControllerObject.delete
)

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
router.patch('/api/pengajuansurvei/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    pengajuaanSurveiControllerObject.update
)
router.delete('/api/pengajuansurvei/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    pengajuaanSurveiControllerObject.delete
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
router.patch('/api/bimbingan/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    bimbinganControllerObject.update
)
router.delete('/api/bimbingan/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    bimbinganControllerObject.delete
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
router.patch('/api/survei/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    surveiControllerObject.update
)
router.delete('/api/survei/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    surveiControllerObject.delete
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
router.patch('/api/rekomendasi/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    rekomendasiControllerObject.update
)
router.delete('/api/rekomendasi/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    rekomendasiControllerObject.delete
)

// Penilaian Bab
router.post('/api/penilaianbab',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,       
    penilaianBabControllerObject.store
)
router.get('/api/penilaianbab',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    penilaianBabControllerObject.index
)
router.patch('/api/penilaianbab/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    penilaianBabControllerObject.update
)
router.delete('/api/penilaianbab/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    penilaianBabControllerObject.delete
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
router.patch('/api/sertifikasi/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    sertifikasiControllerObject.update
)
router.delete('/api/sertifikasi/:id',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    sertifikasiControllerObject.delete
)

// Bab
router.get('/api/bab',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    BabControllerObject.index
)

router.get('/api/inm',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    inmControllerObject.index
)

router.get('/api/ikp',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    ikpControllerObject.index
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