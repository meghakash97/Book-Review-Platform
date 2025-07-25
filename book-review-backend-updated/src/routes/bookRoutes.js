const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/authMiddleware');

// GET all books
router.get('/', authMiddleware, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single book with reviews & avg rating
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: req.params.id }).populate('reviewer', 'username');

    const avgRating = reviews.length
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    res.json({ book, reviews, avgRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST create book
router.post('/', authMiddleware, async (req, res) => {
  const { title, author, genre } = req.body;

  try {
    const newBook = new Book({ title, author, genre });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: 'Invalid book data', error: err.message });
  }
});

//  PUT update book
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, author, genre } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, genre },
      { new: true }
    );

    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });

    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

//  DELETE book and its reviews
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });

    await Review.deleteMany({ book: req.params.id }); 
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

// POST review for a book
router.post('/:id/review', authMiddleware, async (req, res) => {
  const { rating, reviewText } = req.body;

  if (!rating || !reviewText)
    return res.status(400).json({ message: 'Both rating and reviewText are required' });

  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const review = new Review({
      book: req.params.id,
      reviewer: req.user.id,
      rating,
      reviewText,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
});

module.exports = router;
