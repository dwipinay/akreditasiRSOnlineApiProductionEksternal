require('dotenv').config()
const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit : 1,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USERNAME,
    password        : process.env.DB_PASSWORD,
    // database        : process.env.DB_DATABASE
    acquireTimeout  : 3000
})

module.exports = pool