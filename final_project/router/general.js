const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksBy = {};
  Object.keys(books).forEach(key => {
      if (books[key]["author"] === author){
          booksBy = {...booksBy,[key]: books[key]};

      };
  });
  
  return res.send(JSON.stringify(booksBy,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn]["reviews"],null,4));
});

// Get list of all books in the store
public_users.get('/list', async function(req,res){
  await new Promise((resolve,reject) => {
    if(books){
      resolve(console.log("Books found"));
    }
    else{
      reject(console.log("Books not found"));
    }

}).then(res.send(JSON.stringify(books)))
.catch(err => {
  console.log(err)
})
}
);

// Get book from isbn
public_users.get('/list/isbn/:isbn', async function(req,res){
  await new Promise((resolve,reject) => {
    const isbn = req.params.isbn;

    if(books[isbn]){
      resolve(isbn);
    }
    else{
      reject("Book not found");
    }

  })
  .then((isbn)=>{res.send(JSON.stringify(books[isbn]))})
  .catch(err => {
    console.log(err);
    res.send(JSON.stringify({err}));
  })
});

// Get book from author
public_users.get('/list/author/:author', async function(req,res){
  await new Promise((resolve,reject) => {
    const author = req.params.author;
    let booksBy = {};
    let bookFound = false;

    Object.keys(books).forEach(key => {
      if (books[key]["author"] === author){
          booksBy = {...booksBy,[key]: books[key]};
          bookFound = true;
      };
      })
      if (bookFound){
        resolve(booksBy);
      }else{
        reject("Book not found!");
      }

  })
  .then((book)=>{res.send(JSON.stringify(book,null,4))})
  .catch(err => {
    console.log(err);
    res.send(JSON.stringify({err}));
  })
});

// Get book by title
public_users.get('/list/title/:title', async function(req,res){
  await new Promise((resolve,reject) => {
    const title = req.params.title;
    let booksBy = {};
    let bookFound = false;

    Object.keys(books).forEach(key => {
      if (books[key]["title"] === title){
          booksBy = {...booksBy,[key]: books[key]};
          bookFound = true;
      };
      })
      if (bookFound){
        resolve(booksBy);
      }else{
        reject("Book not found!");
      }

  })
  .then((book)=>{res.send(JSON.stringify(book,null,4))})
  .catch(err => {
    console.log(err);
    res.send(JSON.stringify({err}));
  })
});

module.exports.general = public_users;