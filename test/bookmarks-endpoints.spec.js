// const app = require('../src/app')
// const knex = require('knex')

// describe('APP', () => {
//     it('GET / responds with 200 containing "Hello, World!"', () => {
//         return supertest(app)
//         .get('/')
//         .expect(200, 'Hello, World!')
//     })
// })

const knex = require('knex')
const fixtures = require('./bookmarks-fixtures')
const app = require('../src/app')
const store = require('../src/store')

describe('Bookmarks endpoints',() => {
    let bookmarkscopy, db 

    before('make knex instance'() => {
        db = knex({ 
           client: 'pg', 
           connection: process.env.TEST_DB_URL,        
        })
        app.set('db',db)
    })

    after()
})