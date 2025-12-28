import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const BookDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const response = await api.get(`/books/${id}`);
            setBook(response.data.data);

            // Check if user has already rated
            if (user) {
                const userRating = response.data.data.ratings.find(
                    r => r.user._id === user._id
                );
                if (userRating) {
                    setRating(userRating.rating);
                }
            }
        } catch (error) {
            console.error('Error fetching book:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (newRating) => {
        if (!user) {
            setMessage('Please login to rate books');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        try {
            await api.post(`/books/${id}/rate`, { rating: newRating });
            setRating(newRating);
            setMessage('Rating submitted successfully!');
            fetchBook(); // Refresh to get updated average
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to submit rating');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const renderInteractiveStars = () => {
        return (
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                    >
                        <span className={
                            star <= (hoveredRating || rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                        }>
                            ★
                        </span>
                    </button>
                ))}
            </div>
        );
    };

    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                            }`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold mb-4">Book not found</h2>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Back to Library
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="btn-secondary mb-6 inline-flex items-center"
                >
                    ← Back to Library
                </button>

                <div className="card">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold mb-3">{book.title}</h1>
                        <p className="text-xl text-primary-600 dark:text-primary-400 font-medium mb-4">
                            by {book.author}
                        </p>

                        <div className="flex items-center gap-4 mb-6">
                            {renderStars(Math.round(book.averageRating))}
                            <span className="text-gray-600 dark:text-gray-400">
                                {book.averageRating.toFixed(1)} ({book.totalRatings} {book.totalRatings === 1 ? 'rating' : 'ratings'})
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4">Description</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {book.description}
                        </p>
                    </div>

                    {book.fileName && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Download Book</h2>
                            <a
                                href={`http://localhost:5001/api/books/${book._id}/download`}
                                className="inline-flex items-center gap-2 btn-primary"
                                download
                            >
                                📥 Download {book.fileName}
                                <span className="text-sm">({(book.fileSize / (1024 * 1024)).toFixed(2)} MB)</span>
                            </a>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                File type: {book.fileType}
                            </p>
                        </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4">Rate This Book</h2>
                        {message && (
                            <div className={`mb-4 p-3 rounded-lg ${message.includes('success')
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                }`}>
                                {message}
                            </div>
                        )}
                        {renderInteractiveStars()}
                        {rating > 0 && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                You rated this book {rating} star{rating !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Uploaded by {book.uploadedBy.name} on {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
