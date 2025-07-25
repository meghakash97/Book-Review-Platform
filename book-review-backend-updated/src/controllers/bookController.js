const Book = require('../models/Book');

// GET all books
const getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

// POST a new book
const addBook = async (req, res) => {
  const { title, author, genre } = req.body;
  const newBook = new Book({ title, author, genre, reviews: [] });
  const saved = await newBook.save();
  res.status(201).json(saved);
};

// PUT update book
const updateBook = async (req, res) => {
  const { title, author, genre } = req.body;
  const updated = await Book.findByIdAndUpdate(
    req.params.id,
    { title, author, genre },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Book not found' });
  res.json(updated);
};

// DELETE a book
const deleteBook = async (req, res) => {
  const deleted = await Book.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book deleted' });
};

// POST a review
const addReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const newReview = {
    reviewer: req.user._id,
    rating,
    reviewText,
  };

  book.reviews.push(newReview);
  await book.save();
  res.status(201).json({ message: 'Review added' });
};

//  ADDED: GET single book with reviews and avgRating
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate({
      path: 'reviews.reviewer',
      select: 'username',
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const ratings = book.reviews.map(r => r.rating);
    const avgRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    res.json({ book, reviews: book.reviews, avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  addReview,
  getBookById, 
};
