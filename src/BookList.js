import "./BookList.css";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase.config";

const BookList = () => {
  const [book, setBook] = useState({});
  const [books, setBooks] = useState([]);
  const collectionRef = collection(db, "books");

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setBook((values) => ({ ...values, [name]: value }));
  };
  const addBook = async (e) => {
    e.preventDefault();
    try {
      //add book to the collection
      const bookRef = await addDoc(collectionRef, {
        book: book,
      });
      console.log("Adding book with id :", bookRef.id);
      //call the function to update the list on the page
      showBooks();
    } catch (e) {
      // console.error("Error adding document: ", e);
    }
  };
  const deleteBook = async (e) => {
    e.preventDefault();
    try {
      // Use the bookIdToDelete state to get the document ID
      const bookId = e.target.value;
      //doc with reference to collection and book id
      const bookDocRef = doc(collectionRef, bookId);

      // Delete the document and recall the function to remove from the list
      await deleteDoc(bookDocRef);
      showBooks();

      // console.log("Deleting book with id:", bookId);
    } catch (error) {
      // console.error("Error deleting document:", error);
    }
  };

  const showBooks = async () => {
    const querySnapshot = await getDocs(collection(db, "books"));
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log(books);
    setBooks(newData);
  };

  useEffect(() => {
    // Show books when the component initially mounts
    showBooks();
  }, []);
  return (
    <div className="flex-container">
      <h2>Books you want to buy</h2>
      <form onSubmit={addBook} className="bookForm">
        <label htmlFor="title">Book</label>
        <input type="text" name="title" onChange={handleChange}></input>
        <label htmlFor="author">Author</label>
        <input type="text" name="author" onChange={handleChange}></input>
        <label htmlFor="price">Price</label>
        <input type="number" name="price" onChange={handleChange}></input>
        <button type="submit">Add book</button>
      </form>

      <div className="book-list">
        {books.length > 0 ? (
          <ul>
            {books.map((book, index) => (
              <div className="book-link">
                <li key={book.id}>
                  {book.book.title}, {book.book.author}, {book.book.price}€
                </li>
                <button value={book.id} onClick={deleteBook}>
                  Delete
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p>No books available.</p>
        )}{" "}
      </div>
    </div>
  );
};
export default BookList;
