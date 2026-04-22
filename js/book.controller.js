'use strict'

var gCurrBookId = null
var gEditedBookId = null

function onInit() {
  readQueryParams()
  renderBooks()
}

function renderBooks() {
  var books = getBooks()
  var elContainer = document.querySelector('.books-container')

  if (!books.length) {
    elContainer.innerHTML = `
            <tr>
                <td colspan="4">No matching books were found...</td>
            </tr>
        `
    renderStats()
    return
  }

  var strHTML = books.map(book => {
    var stars = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating)

    return `
      <tr>
        <td><img src="${book.imgUrl}" alt="${book.title}"></td>
        <td>${book.title}</td>
        <td>${book.price}</td>
        <td>${stars}</td>
        <td>
        <button onclick="onReadBook('${book.id}')">Read</button>
        <button onclick="onUpdateBook('${book.id}')">Update</button>
        <button onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
      </tr>
    `
  }).join('')

  elContainer.innerHTML = strHTML
  renderStats()
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
  showMsg('Book removed successfully')
}

function onUpdateBook(bookId) {
  gEditedBookId = bookId

  var book = getBookById(bookId)
  var elModal = document.querySelector('.add-modal')

  document.querySelector('#book-title').value = book.title
  document.querySelector('#book-price').value = book.price

  document.querySelector('.modal-title-add').innerText = 'Edit Book'
  document.querySelector('.save-btn').innerText = 'Save Changes'

  elModal.style.display = 'block'
}

function onAddBook() {
  gEditedBookId = null

  var elModal = document.querySelector('.add-modal')

  document.querySelector('#book-title').value = ''
  document.querySelector('#book-price').value = ''

  document.querySelector('.modal-title-add').innerText = 'Add Book'
  document.querySelector('.save-btn').innerText = 'Add'

  elModal.style.display = 'block'
}

function onCloseAddModal() {
  var elModal = document.querySelector('.add-modal')
  elModal.style.display = 'none'
}

function onSaveBook() {
  var elTitle = document.querySelector('#book-title')
  var elPrice = document.querySelector('#book-price')

  var title = elTitle.value
  var price = +elPrice.value

  if (!title || !price) return

  if (gEditedBookId) {
    updateBook(gEditedBookId, title, price)
    showMsg('Book updated successfully')
  } else {
    addBook(title, price)
    showMsg('Book added successfully')
  }

  renderBooks()
  onCloseAddModal()
}

function onReadBook(bookId) {
  gCurrBookId = bookId

  var book = getBookById(bookId)

  var elModal = document.querySelector('.modal')
  var elTitle = document.querySelector('.modal-title')
  var elPrice = document.querySelector('.modal-price')
  var elBookImg = document.querySelector('.modal-book-img')
  var elRatingValue = document.querySelector('.modal-rating-value')

  elTitle.innerText = 'Title: ' + book.title
  elPrice.innerText = 'Price: ' + book.price
  elRatingValue.innerText = book.rating
  elBookImg.src = book.imgUrl
  elBookImg.alt = book.title
  
  elModal.style.display = 'block'
}

function onCloseModal() {
  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
}

function onSetFilterBy() {
  var elTitleFilter = document.querySelector('#filter-by-title')
  var elRatingFilter = document.querySelector('#filter-by-rating')

  var filterBy = {
    title: elTitleFilter.value,
    minRating: +elRatingFilter.value
  }

  setFilterBy(filterBy)
  setQueryParams()
  renderBooks()
}

function onClearFilter() {
  var elTitleFilter = document.querySelector('#filter-by-title')
  var elRatingFilter = document.querySelector('#filter-by-rating')

  elTitleFilter.value = ''
  elRatingFilter.value = '0'

  var filterBy = {
    title: '',
    minRating: 0
  }

  setFilterBy(filterBy)
  setQueryParams()
  renderBooks()
}

function onNextPage() {
  nextPage()
  setQueryParams()
  renderBooks()
}

function onPrevPage() {
  prevPage()
  setQueryParams()
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

function onIncreaseRating() {
  var book = getBookById(gCurrBookId)

  if (book.rating === 5) return

  var newRating = book.rating + 1
  updateBookRating(gCurrBookId, newRating)

  document.querySelector('.modal-rating-value').innerText = newRating
  renderBooks()
}

function onDecreaseRating() {
  var book = getBookById(gCurrBookId)

  if (book.rating === 0) return

  var newRating = book.rating - 1
  updateBookRating(gCurrBookId, newRating)

  document.querySelector('.modal-rating-value').innerText = newRating
  renderBooks()
}

function onSetSortBy() {
  var elSortBy = document.querySelector('#sort-by')
  var elSortDir = document.querySelector('input[name="sort-dir"]:checked')

  var sortBy = {
    type: elSortBy.value,
    desc: elSortDir.value === 'desc'
  }

  setSortBy(sortBy)
  setQueryParams()
  renderBooks()
}

function readQueryParams() {
  const queryParams = new URLSearchParams(window.location.search)

  var filterBy = {
    title: queryParams.get('title') || '',
    minRating: +queryParams.get('minRating') || 0
  }

  var sortBy = {
    type: queryParams.get('sortField') || '',
    desc: queryParams.get('sortDir') === 'desc'
  }

  var pageIdx = +queryParams.get('pageIdx') || 0

  setQueryParamsState(filterBy, sortBy, pageIdx)

  renderQueryParams()
}

function renderQueryParams() {
  var filterBy = getFilterBy()
  var sortBy = getSortBy()

  document.querySelector('#filter-by-title').value = filterBy.title
  document.querySelector('#filter-by-rating').value = filterBy.minRating

  document.querySelector('#sort-by').value = sortBy.type

  var sortDir = sortBy.desc ? 'desc' : 'asc'
  document.querySelector(`input[name="sort-dir"][value="${sortDir}"]`).checked = true
}

function setQueryParams() {
  const queryParams = new URLSearchParams()

  const filterBy = getFilterBy()
  const sortBy = getSortBy()
  const pageIdx = getPageIdx()

  queryParams.set('title', filterBy.title)
  queryParams.set('minRating', filterBy.minRating)

  if (sortBy.type) {
    queryParams.set('sortField', sortBy.type)
    queryParams.set('sortDir', sortBy.desc ? 'desc' : 'asc')
  }

  queryParams.set('pageIdx', pageIdx)

  const newUrl =
    window.location.protocol + "//" +
    window.location.host +
    window.location.pathname + '?' + queryParams.toString()

  window.history.pushState({ path: newUrl }, '', newUrl)
}