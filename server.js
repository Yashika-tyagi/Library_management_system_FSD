const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Book = require("./library/student.library");

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


/* ================================
   ADD NEW BOOK
================================ */
app.post("/books", async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


/* ================================
   GET ALL BOOKS
================================ */
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/* ================================
   SEARCH BOOK BY TITLE OR AUTHOR
   Example:
   /books/search?title=DBMS
   /books/search?author=John
================================ */
app.get("/books/search", async (req, res) => {
    try {
        const { title, author } = req.query;

        if (!title && !author) {
            return res.status(400).json({ message: "Title or Author query is required" });
        }

        const query = {};

        if (title) query.title = title;
        if (author) query.author = author;

        const books = await Book.find(query);

        res.json(books);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/* ================================
   GET BOOK BY ID
================================ */
app.get("/books/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);

    } catch (error) {
        res.status(400).json({ error: "Invalid ID format" });
    }
});


/* ================================
   UPDATE BOOK
================================ */
app.put("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);

    } catch (error) {
        res.status(400).json({ error: "Invalid ID format" });
    }
});


/* ================================
   DELETE BOOK
================================ */
app.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully" });

    } catch (error) {
        res.status(400).json({ error: "Invalid ID format" });
    }
});


// Start Server
app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});