const uuid = require('uuid/v4')

const bookmarks = [
  { id: uuid(),
  title: 'google',
  url: 'https://www.google.com',
  description: 'Search Engine',
  rating: 4 },
]

module.exports = { bookmarks }