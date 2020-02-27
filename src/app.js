require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV} = require('./config')
const validateBearerToken = require('./validateBearerToken')
const errorHandler = require('./errorHandler')
const bookmarksRouter = require('./bookmarks/bookmarksRouter')
const uuid = require('uuid/v4')
const knex = require('knex')
const BookmarkService = require('./bookmarks/bookmarks-service')

// const knexInstance = knex({
//     client: 'pg',
//     connection: process.env.DB_URL,
//   })
 

const app = express()

// const morganOption = (NODE_ENV === 'production')
// ? 'tiny'
// : 'common';
app.use(morgan((NODE_ENV === 'production') ? 'tiny': 'common',{
    skip: () => NODE_ENV === 'test'   
}))

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(validateBearerToken)
app.use(bookmarksRouter)
app.get('/',(req, res) => {
    res.send('Hello World')
})
app.use(errorHandler)

module.exports = app



// postman ex.


// {
//     "firstName": "joe",
//     "lastName": "johnson",
//     "address1": "424 Fairfax ave.",
//     "address2": "323 sunset blvd",
//     "city": "Los Angeles",
//     "state": "CA",
//     "zip": "90210"
// }