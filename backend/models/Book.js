const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a book title'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Please provide an author name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true
    },
    fileName: {
        type: String,
        default: null
    },
    filePath: {
        type: String,
        default: null
    },
    fileType: {
        type: String,
        default: null
    },
    fileSize: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: {
        type: Date
    },
    rejectedAt: {
        type: Date
    }
});

// Calculate average rating before saving
bookSchema.methods.calculateAverageRating = function () {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
        this.totalRatings = 0;
    } else {
        const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
        this.averageRating = (sum / this.ratings.length).toFixed(1);
        this.totalRatings = this.ratings.length;
    }
};

module.exports = mongoose.model('Book', bookSchema);
