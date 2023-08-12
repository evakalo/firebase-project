import "./BookList.css";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  where,
  query,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase.config";

const BookList = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);

  //collection ref - odnosi se na books collection
  const collectionRef = collection(db, "books");

  //queries - 2 arguments - collection ref and where function
  // where function-  takes 3 arguments -property name, comparison and what it has to check
  //here author value is equal to homer

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "title") {
      setTitle(value);
    } else if (name === "author") {
      setAuthor(value);
    } else if (name === "price") {
      setPrice(value);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      //add book to the collection
      const bookRef = await addDoc(collectionRef, {
        title: title,
        author: author,
        price: price,
        createdAt: serverTimestamp(),
      });
      console.log("Adding book with id :", bookRef.id);
      //call the function to update the list on the page
      showBooks();
    } catch (e) {
      console.error("Error adding document: ", e);
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
    const querySnapshot = await getDocs(collectionRef);
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    //sorts the newest on the top
    const sortedData = newData.sort((a, b) => {
      const dateA = a.createdAt.toDate().getTime();
      const dateB = b.createdAt.toDate().getTime();
      return dateB - dateA;
    });

    setBooks(sortedData);
  };
  useEffect(() => {
    // Show books when the component initially mounts
    showBooks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //search list by author and sort the books alphabetically
  const searchByAuthor = async (e) => {
    e.preventDefault();

    const q = query(
      collectionRef,
      where("author", "==", search),
      orderBy("title", "asc")
    );
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setBooks(newData);
  };
  useEffect(() => {
    // Show books when the component initially mounts
    showBooks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex-container">
      {" "}
      <h2>Books you want to buy</h2>
      <form onSubmit={addBook} className="bookForm">
        <label htmlFor="title">Book</label>
        <input type="text" name="title" onChange={handleChange}></input>
        <label htmlFor="author">Author</label>
        <input type="text" name="author" onChange={handleChange}></input>
        <label htmlFor="price">Price</label>
        <input type="number" name="price" onChange={handleChange}></input>
        <button type="submit">Add book</button>{" "}
      </form>
      <form onSubmit={searchByAuthor} className="bookSearch">
        <label>Search your list by author</label>
        <input
          type="search"
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button type="submit">Search</button>{" "}
      </form>
      <div className="book-list">
        {books.length > 0 ? (
          <ul>
            {books.map((book, index) => (
              <div className="book-link">
                <li key={book.id}>
                  {book.title}, {book.author}, {book.price}€
                </li>
                <button value={book.id} onClick={deleteBook}>
                  Delete
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p style={{ padding: "10px" }}>No books available.</p>
        )}{" "}
      </div>
    </div>
  );
};
export default BookList;
