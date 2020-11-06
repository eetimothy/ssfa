//import lib
const express = require('express')
const handlebars = require('express-handlebars')
const mysql = require('mysql2/promise')
const fetch = require('node-fetch')
const withQuery = require('with-query').default


//declare const
const PORT = parseInt(process.argv[2]) || parseInt(process.env_PORT) || 3000
const SQL_GET_ALPHABET = `SELECT * FROM book2018 WHERE TITLE LIKE '%' limit 10`
const SQL_GET_TITLES = 'select * from book2018 where book_id = ?'
const ENDPOINT = 'https://api.nytimes.com/svc/books/v3/reviews.json'
const PUBLIC = process.env.API_PUBLIC
const PRIVATE = process.env.API_PRIVATE
const APP_ID = 'f815e67c-8998-4be9-a718-6836ed9d77d8'

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

app.get('/landing', async (req, res) => {
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const num = "0123456789".split("")

    res.status(200)
    res.type('text/html')
    res.render('landing', {abc: 'abc'})
})


app.get('/', async (req, res) => {

    //get list of books
    const conn = await pool.getConnection()
    try {
        const sqlQuery = await pool.query(SQL_GET_ALPHABET, ['title', 100])


        res.status(200)
        res.type('text/html')
        res.render('index', { results: sqlQuery[0] })
    }

    catch (e) {
        res.status(500)
        res.type('text/html')
        res.send('error')
        return Promise.reject(e)
    }
    finally {
        conn.release()
    }
})

app.get('/books/:book_id', async (req, res) => {
    const conn = await pool.getConnection()
    try {
        const sqlQuery = await pool.query(SQL_GET_TITLES, [req.params.book_id])


        res.status(200)
        res.type('text/html')
        res.render('books', { results: sqlQuery[0] })

    }
    catch (e) {
        res.status(200)
        res.type('text/html')
        res.send('error')
        return Promise.reject(e)
    }
    finally {
        conn.release()
    }
})

//API Application
app.get('/reviews', async (req, res) => {
    const conn = await pool.getConnection()
    const [book] = await pool.query(SQL_GET_TITLES, [req.query.book_id])
    
    const url = await fetch(withQuery(
        ENDPOINT, 
        {
            title: book[0]['title'],
            'api-key': PUBLIC
        }

    ))
    const result = await url.json()
    
        res.status(200)
        res.type('text/html')
        res.render('reviews', {result: url})
    
})



//start server
app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
})