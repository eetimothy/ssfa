//import lib
const express = require('express')
const handlebars = require('express-handlebars')
const mysql = require('mysql2/promise')
const fetch = require('node-fetch')
const withQuery = require('with-query')


//declare const
const PORT = parseInt(process.argv[2]) || parseInt(process.env_PORT) || 3000


// declare database, create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: 'goodreads',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 4,
    timezone: '+08:00'
})


//express
const app = express()

//hbs
app.engine('hbs', handlebars({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')

//application
app.get('/', async (req, res) => {
    // landing page
    res.status(200)
    res.type('index.html')
    res.render('index')
})


//start server
app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
})