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
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase.config";

const BookList = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [id, setId] = useState("");
  const [editBook, setEditBook] = useState("");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  //collection ref - odnosi se na books collection
  const collectionRef = collection(db, "books");

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "title") {
      setTitle(value); // Set title to an empty string if input is empty
    } else if (name === "author") {
      setAuthor(value);
    } else if (name === "price") {
      setPrice(value);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      const bookRef = await addDoc(collectionRef, {
        title: title,
        author: author,
        price: price,
        createdAt: serverTimestamp(),
      });
      console.log("Adding book with id:", bookRef.id);
      //call the function to update the list on the page
      showBooks();
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      //use bookId to set the document to delete
      const bookDocRef = doc(collectionRef, bookId);
      // Delete the document and recall the function to remove from the list
      await deleteDoc(bookDocRef);

      showBooks();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
  const handleUpdate = (title, author, price, id) => {
    setTitle(title);
    setAuthor(author);
    setPrice(price);
    setId(id);
    setEditBook(true);
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
  // Show books when the component initially mounts
  useEffect(() => {
    showBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchByAuthor = async (e) => {
    e.preventDefault();

    //queries - 2 arguments - collection ref and where function
    // where function-  takes 3 arguments -property name, comparison and what it has to check
    //here author value is equal to homer
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

  const updateBook = async (e) => {
    e.preventDefault();
    console.log("update");
    const bookId = id;
    const bookDocRef = doc(collectionRef, bookId);

    try {
      await updateDoc(bookDocRef, {
        title: title,
        author: author,
        price: price,
      });

      setTitle("");
      setAuthor("");
      setPrice("");

      showBooks();
      //set to change the button again from update to add
      setEditBook(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div className="flex-container">
      <h2>Books you want to buy</h2>
      <form className="bookForm">
        <label htmlFor="title">Book</label>
        <input type="text" name="title" onChange={handleChange} value={title} />
        <label htmlFor="author">Author</label>
        <input
          type="text"
          name="author"
          onChange={handleChange}
          value={author}
        />
        <label htmlFor="price">Price</label>
        <input
          type="number"
          name="price"
          onChange={handleChange}
          value={price}
        />
        {!editBook ? (
          <button type="submit" onClick={addBook}>
            Add book
          </button>
        ) : (
          <button type="submit" onClick={updateBook}>
            Update book
          </button>
        )}
      </form>
      <form onSubmit={searchByAuthor} className="bookSearch">
        <label>Search your list by author</label>
        <input type="search" onChange={(e) => setSearch(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <div className="book-list">
        {books.length > 0 ? (
          <ul>
            {books.map((book, index) => (
              <div key={book.id} className="book-link">
                <li>
                  {book.title}, {book.author}, {book.price}€
                </li>
                <button value={book.id} onClick={() => deleteBook(book.id)}>
                  Delete
                </button>{" "}
                <button
                  onClick={() =>
                    handleUpdate(book.title, book.author, book.price, book.id)
                  }
                >
                  Update
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p style={{ padding: "10px" }}>No books available.</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
