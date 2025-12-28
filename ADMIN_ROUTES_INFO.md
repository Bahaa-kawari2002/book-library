const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/books
// @desc    Get all approved books
// @access  Public
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ status: 'approved' })
      .populate('uploadedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/books/pending
// @desc    Get all pending books (Admin only)
// @access  Private/Admin
router.get('/pending', protect, adminOnly, async (req, res) => {
  try {
    const books = await Book.find({ status: 'pending' })
      .populate('uploadedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/books/admin/all
// @desc    Get all books (all statuses) - Admin only
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const books = await Book.find()
      .populate('uploadedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Rest of the file follows (keeping all other routes as is)
