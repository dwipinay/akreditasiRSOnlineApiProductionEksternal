const express = require('express')
const cors = require('cors')
const apiRouter = require('./routes/api')
const docRouter = require('./routes/docs')
const app = express()

app.use(express.json())
app.use(cors())
app.use(apiRouter)
app.use(docRouter)

const port = process.env.PORT || 3030
app.listen(port, () => console.log(`listening on port ${port}`))