
'use strict'

function onInit() {
    renderBooks()
}

function renderBooks() {
    var books = getBooks()

    var strHTML = books.map(book => `
  <tr>
    <td>${book.title}</td>
    <td>${book.price}</td>
    <td>
    <button onclick="onReadBook('${book.id}')">Read</button>
    <button onclick="onUpdateBook('${book.id}')">Update</button>
    <button onclick="onRemoveBook('${book.id}')">Delete</button>
</td>
  </tr>
`).join('')

    var elContainer = document.querySelector('.books-container')
    elContainer.innerHTML = strHTML
    renderStats()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    showMsg('Book removed successfully')
}

function onUpdateBook(bookId) {
  var price = +prompt('Enter new price:')
  updateBook(bookId, price)
  renderBooks()
  showMsg('Book updated successfully')
}

function onAddBook() {
  var title = prompt('Enter book title:')
  var price = prompt('Enter book price:')

  if (!title || !price) return

  addBook(title, +price)
  renderBooks()
  showMsg('Book added successfully')
}

function onReadBook(bookId) {
  var book = getBookById(bookId)

  var elModal = document.querySelector('.modal')
  var elTitle = document.querySelector('.modal-title')
  var elPrice = document.querySelector('.modal-price')

  elTitle.innerText = 'Title: ' + book.title
  elPrice.innerText = 'Price: ' + book.price

  elModal.style.display = 'block'
}

function onCloseModal() {
  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
}

function onSetFilterBy() {
  var elFilter = document.querySelector('#filter-by-title')
  var filterBy = {
    title: elFilter.value
  }

  setFilterBy(filterBy)
  renderBooks()
}

function onClearFilter() {
  var elFilter = document.querySelector('#filter-by-title')
  elFilter.value = ''

  var filterBy = {
    title: ''
  }

  setFilterBy(filterBy)
  renderBooks()
}

function onNextPage() {
  nextPage()
  renderBooks()
}

function onPrevPage() {
  prevPage()
  renderBooks()
}

function showMsg(txt) {
  var elMsg = document.querySelector('.user-msg')

  elMsg.innerText = txt

  setTimeout(function () {
    elMsg.innerText = ''
  }, 2000)
}

function renderStats() {
  var stats = getBooksStats()

  var elStats = document.querySelector('.stats')

  elStats.innerText = `
    Expensive: ${stats.expensive} |
    Average: ${stats.average} |
    Cheap: ${stats.cheap}
  `
}