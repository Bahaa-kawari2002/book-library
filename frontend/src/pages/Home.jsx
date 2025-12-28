import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                    Discover Amazing Books
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Browse our collection of books uploaded by the community
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    className="input-field"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Books Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading books...</p>
                </div>
            ) : filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        {searchTerm ? 'No books found matching your search' : 'No books available yet'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                        <Link
                            key={book._id}
                            to={`/book/${book._id}`}
                            className="card hover:scale-105 transition-transform duration-200"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{book.title}</h3>
                                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                                        by {book.author}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                                        {book.description}
                                    </p>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {renderStars(Math.round(book.averageRating))}
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {book.totalRatings} {book.totalRatings === 1 ? 'rating' : 'ratings'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
