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

    before('make knex instance', () => {
        db = knex({ 
           client: 'pg', 
           connection: process.env.TEST_DB_URL,        
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db('bookmarks').truncate())

    afterEach('cleanup', () => db('bookmarks').truncate())

    beforeEach('copy the bookmarks', () => {
        bookmarksCopy = store.bookmarks.slice()
    })

    afterEach('Bring back the bookmarks', () => {
        store.bookmarks = bookmarksCopy
    })

    describe(`Not Authorized to make requests`, () => {
        it(`responds with 401 Unauthorized for GET /bookmarks`, () => {
            return supertest(app)
            .get('/bookmarks')
            .expect(401, { error: `Unauthorized request made`})
        })
        
        it(`responds with 401 Unathorizued for POST /bookmarks`, () => {
                return supertest(app)
                .post('/bookmarks')
                .send({ title: 'test-title', url: 'https://BadURL.Does.notwork.com', rating: 1 })
                .expect(401, { error: 'Unauthorized request' })
        })

        it(`responds with 401 UNauthorized for GET /bookmarks/:id`, () => {
            const secondBookmark = store.bookmarks[1]
            return supertest(app)
                .get(`bookmarks/${secondBookmark.id}`)
                .expect(401, { error: 'Unauthroized request'})
        })

        it(`responds with  401 Unauthorized for DELETE /bookmarks/:id`, () =>{
            const aBookmark = store.bookmarks[1]
            return supertest(app)
                .delete(`/bookmarks/${aBookmark.id}`)
                .expect(401, {error: 'Dont touch my bookmarks' })
        })
        })

        describe('GET /bookmarks', () => {
            context(`Given no bookmarks`, () => {
                it(`responds with 200 and an empty list`, () => {
                    return supertest(app)
                        .get('/bookmarks')
                        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(200, [])
                })
            })

            context('If there are more bookmarks in the database', () => {
                const testBookmarks = fixtures.makeBookmarksArray()

                beforeEach('insert bookmarks', () => {
                    return db
                        .into('bookmarks')
                        .insert(testBookmarks)
                })

                it('gets the bookmarks from the store', () => {
                    return supertest(app)
                        .get('/bookmarks')
                        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(200, testBookmarks)
                })
            })
        })

        describe('GET /bookmarks/:id', () => {
            context(`Given no bookmarks`, () => {
                it(`responds 404 when the bookmark doesn't exist`, () =>{
                    return supertest(app)
                    .get (`/bookmarks/123`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {
                        error: { message: `Bookmark NOT Found` }
                    })
                })
            })

            context('Given there are bookmarks present in the database', () =>{
                const testBookmarks = fixtures.makeBookmarksArray()

                beforeEach('insert bookmarks', () => {
                    return db
                        .into('bookmarks')
                        .insert(testBookmarks)
                })

                it('responds with 200 and the specified bookmark', () => {
                    const bookmarkId = 2
                    const expectedBookmark = testBookmarks[bookmarkId - 1]
                    return supertest(app)
                        .get(`/bookmarks/${bookmarkId}`)
                        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(200, expectedBookmark)
                     })
                 })
            })

        describe('DELETE /bookmarks/:id', () => {
            it('removes the bookmark by ID from the store', () => {
                const secondBookmark = store.bookmarks[1]
                const expectedBookmarks = store.bookmarks.filter(s => s.id !== secondbookmark.id)
                return supertest(app)
                    .delete(`/bookmarks/${secondBookmark.id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(204)
                    .then(() => {
                        expect(store.bookmarks).to.eql(expectedBookmarks)
                    })
                 })

                 it(` returns 404 when the bookmark doesn't exist`, () => {
                     return supertest(app)
                        .delete(`/bookmarks/doesnt-exist`)
                        .set ('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(404, 'Bookmark Not Found')
                    })
                })

                describe('POST /bookmarks', () => {
                    it(`responds with 400 missing 'title' if not supplied`, () => {
                        const newBookmarkMissingTitle = {
                            url: 'https://test.com',
                            rating: 1,
                        }
                        return supertest(app)
                            .post(`/bookmarks`)
                            .send(newBookmarkMissingTitle)
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect(400, `'title' is required`)
                    })

                    it(`responds with 400 missing 'url' if not supplied`, () => {
                        const newBookmarkMissingUrl = {
                            title: 'test-title',
                            rating: 1,
                        }
                        return supertest(app)
                            .post(`/bookmarks`)
                    })
                })

    })

