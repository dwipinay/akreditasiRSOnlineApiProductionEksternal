const express = require('express')
const router = express.Router()

const swaggerUi = require('swagger-ui-express')
const apiDoc2022022421 = require('../documentations/apiDoc2022022421.json')

router.use('/apidoc2022022421', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDoc2022022421);
    res.send(html);
})

module.exports = router