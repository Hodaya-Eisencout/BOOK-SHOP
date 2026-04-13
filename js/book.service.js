
'use strict'

var gBooks
var gPageIdx = 0
var PAGE_SIZE = 5

var gFilterBy = {
    title: ''
}

_createBooks()

function _createBooks() {

    gBooks = _loadBooks()

    if (!gBooks || !gBooks.length) {

        gBooks = [
            { id: 'b101', title: 'Harry Potter', price: 120, rating: 0 },
            { id: 'b102', title: 'The Hobbit', price: 90, rating: 0},
            { id: 'b103', title: '1984', price: 80, rating: 0 }
        ]
        _saveBooks()
    }
}

function _loadBooks() {
    var books = localStorage.getItem('bookDB')
    return JSON.parse(books)
}

function _saveBooks() {
    var booksToSave = JSON.stringify(gBooks)
    localStorage.setItem('bookDB', booksToSave)
}

function getBooks() {
  var books = _getFilteredBooks()

  var startIdx = gPageIdx * PAGE_SIZE
  books = books.slice(startIdx, startIdx + PAGE_SIZE)

  return books
}

function removeBook(bookId) {
    var idx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(idx, 1)
    _saveBooks()
}

function updateBook(bookId, newPrice) {
    var book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooks()
}

function addBook(title, price) {
    var book = {
        id: 'b' + Date.now(),
        title: title,
        price: price,
        rating: 0
    }

    gBooks.push(book)
    _saveBooks()
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function nextPage() {
  var booksLength = _getFilteredBooks().length
  var maxPageIdx = Math.ceil(booksLength / PAGE_SIZE) - 1

  gPageIdx++

  if (gPageIdx > maxPageIdx) gPageIdx = 0
}

function prevPage() {
  var booksLength = _getFilteredBooks().length
  var maxPageIdx = Math.ceil(booksLength / PAGE_SIZE) - 1

  gPageIdx--

  if (gPageIdx < 0) gPageIdx = maxPageIdx
}

function setFilterBy(filterBy) {
    gFilterBy = filterBy
}

function _getFilteredBooks() {
  var books = gBooks

  if (gFilterBy.title) {
    books = gBooks.filter(book =>
      book.title.toLowerCase().includes(gFilterBy.title.toLowerCase())
    )
  }

  return books
}

function getBooksStats() {
  var stats = {
    expensive: 0,
    average: 0,
    cheap: 0
  }

  gBooks.forEach(book => {
    if (book.price > 200) stats.expensive++
    else if (book.price >= 80) stats.average++
    else stats.cheap++
  })

  return stats
}

function updateBookRating(bookId, newRating) {
    var book = gBooks.find(book => book.id === bookId)
    book.rating = newRating
    _saveBooks()
}
