// routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authenticateToken = require('../middleware/authMiddleware'); 

router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log(' Request body:', req.body);
    console.log(' Authenticated user:', req.user);

    const { title, author, genre } = req.body;

    // Defensive check
    if (!title || !author || !genre) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBook = new Book({
      title,
      author,
      genre,
      user: req.user.id, 
    });

    const savedBook = await newBook.save();
    console.log('✅ Book saved:', savedBook);

    res.status(201).json({ message: 'Book added successfully', book: savedBook });
  } catch (error) {
    console.error(' Error in POST /api/books:', error.message);
    res.status(500).json({ message: 'Server error while creating book' });
  }
});

module.exports = router;
