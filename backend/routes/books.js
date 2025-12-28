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

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('uploadedBy', 'name email')
            .populate('ratings.user', 'name');

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/books
// @desc    Upload a new book (with optional file)
// @access  Private
router.post('/', protect, upload.single('bookFile'), async (req, res) => {
    try {
        const { title, author, description } = req.body;

        const bookData = {
            title,
            author,
            description,
            uploadedBy: req.user._id
        };

        // If file was uploaded, add file information
        if (req.file) {
            bookData.fileName = req.file.originalname;
            bookData.filePath = req.file.path;
            bookData.fileType = req.file.mimetype;
            bookData.fileSize = req.file.size;
        }

        const book = await Book.create(bookData);

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/books/:id/rate
// @desc    Rate a book
// @access  Private
router.post('/:id/rate', protect, async (req, res) => {
    try {
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (book.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Cannot rate a book that is not approved'
            });
        }

        // Check if user already rated this book
        const existingRatingIndex = book.ratings.findIndex(
            r => r.user.toString() === req.user._id.toString()
        );

        if (existingRatingIndex > -1) {
            // Update existing rating
            book.ratings[existingRatingIndex].rating = rating;
        } else {
            // Add new rating
            book.ratings.push({
                user: req.user._id,
                rating
            });
        }

        // Calculate average rating
        book.calculateAverageRating();
        await book.save();

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/books/:id/approve
// @desc    Approve a book (Admin only)
// @access  Private/Admin
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        book.status = 'approved';
        book.approvedAt = Date.now();
        await book.save();

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/books/:id/reject
// @desc    Reject a book (Admin only)
// @access  Private/Admin
router.put('/:id/reject', protect, adminOnly, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        book.status = 'rejected';
        book.rejectedAt = Date.now();
        await book.save();

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/books/:id/download
// @desc    Download book file
// @access  Public
router.get('/:id/download', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (!book.filePath) {
            return res.status(404).json({
                success: false,
                message: 'No file available for this book'
            });
        }

        // Send file
        res.download(book.filePath, book.fileName);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/books/:id
// @desc    Update book details (Admin only)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { title, author, description, status } = req.body;

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Update fields
        if (title) book.title = title;
        if (author) book.author = author;
        if (description) book.description = description;
        if (status) book.status = status;

        await book.save();

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Delete file if exists
        if (book.filePath) {
            const fs = require('fs');
            if (fs.existsSync(book.filePath)) {
                fs.unlinkSync(book.filePath);
            }
        }

        await Book.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
