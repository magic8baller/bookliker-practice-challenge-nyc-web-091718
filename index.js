// BONUS: Can you make it so a second patch request to the same book removes your user from the list of users? Can you toggle likes on and off?


const myId = 1
const myUsername = 'pouros'

document.addEventListener("DOMContentLoaded", function() {
  const bookContainer = document.querySelector('#list')
  const bookPanel = document.querySelector('#list-panel')
  const showPanel = document.querySelector('#show-panel')
  let allBooks

  // FETCH FOR BOOKS
  fetch(`http://localhost:3000/books`)
    .then(resp => resp.json())
    .then(bookData => {
      allBooks = bookData
      bookData.forEach(book => {
        bookContainer.innerHTML += `
        <li data-id="${book.id}">${book.title}</li>
        `
      }) // end of forEach
    }) // end of initial fetch

  // LISTENERS

  bookPanel.addEventListener('click', (event) => {
    // debugger
    if (event.target.nodeName == 'LI') {
      let bookNum = event.target.dataset.id
      showBook(bookNum)
    }
  }) // end of bookPanel listener

  showPanel.addEventListener('click', (event) => {
    if (event.target.className == 'book-btn') {
      let bookNum = event.target.dataset.id
      likeBook(bookNum)
    }
  })

  // FUNCTIONS
  function showBook(bookNum) {
    // identify book
    let book = allBooks.find(book=> (book.id == bookNum))
    // set a variable to render users
    let users = getUsers(book)
    // render on page
    showPanel.innerHTML = `
      <h1>${book.title}</h1>
      <p><img src="${book.img_url}" alt="${book.title} thumbnail"></p>
      <p>${book.description}</p>
      <h3>${users}</h3>
      <button type="button" class="book-btn" data-id="${book.id}">Read Book</button>
    `
  } // end of show book

  function getUsers(book) {
    let arrayOfUsers = book.users

    let usernames = []
    for (const user of arrayOfUsers) {
      usernames.push(user.username)
    }
    return usernames.join(", ")
  } // end of getUsers

  function likeBook(bookNum) {
    let book = allBooks.find(book=> (book.id == bookNum))
     console.log(book);
    let users = getUsers(book)
    if (users.includes(`${myUsername}`)){
       // if already liked, send alert
       alert("You already liked this.")
    } else {
       // like the book
       let arrayOfLikes = book.users
       arrayOfLikes.push({id:`${myId}`, username: `${myUsername}`})
       // debugger
       sendPatch(arrayOfLikes, book)
       showBook(book.id)
    } // end of if-else
  } // end of likeBook

   function sendPatch(arrayOfLikes, book) {
     fetch(`http://localhost:3000/books/${book.id}`, {
       method: "PATCH",
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({
         users: arrayOfLikes
       })
     }) //end of fetch
   } // end of sendPatch


}); // end of DOMContentLoaded
