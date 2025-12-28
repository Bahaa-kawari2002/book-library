import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending'); // pending, all, users
    const [pendingBooks, setPendingBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'pending') {
                const response = await api.get('/books/pending');
                setPendingBooks(response.data.data);
            } else if (activeTab === 'all') {
                const response = await api.get('/books/admin/all');
                setAllBooks(response.data.data);
            } else if (activeTab === 'users') {
                const response = await api.get('/users');
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showMessage('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (msg, type = 'success') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(''), 3000);
    };

    const handleApprove = async (bookId) => {
        try {
            await api.put(`/books/${bookId}/approve`);
            showMessage('Book approved successfully!');
            fetchData();
        } catch (error) {
            showMessage('Failed to approve book', 'error');
        }
    };

    const handleReject = async (bookId) => {
        try {
            await api.put(`/books/${bookId}/reject`);
            showMessage('Book rejected');
            fetchData();
        } catch (error) {
            showMessage('Failed to reject book', 'error');
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (!confirm('Are you sure you want to delete this book?')) return;

        try {
            await api.delete(`/books/${bookId}`);
            showMessage('Book deleted successfully!');
            fetchData();
        } catch (error) {
            showMessage('Failed to delete book', 'error');
        }
    };

    const handleUpdateBook = async (bookId, updates) => {
        try {
            await api.put(`/books/${bookId}`, updates);
            showMessage('Book updated successfully!');
            setEditingBook(null);
            fetchData();
        } catch (error) {
            showMessage('Failed to update book', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/users/${userId}`);
            showMessage('User deleted successfully!');
            fetchData();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Failed to delete user', 'error');
        }
    };

    const handleSearchUsers = async () => {
        if (!searchQuery.trim()) {
            fetchData();
            return;
        }

        try {
            const response = await api.get(`/users/search?q=${searchQuery}`);
            setUsers(response.data.data);
        } catch (error) {
            showMessage('Search failed', 'error');
        }
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage books and users
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'pending'
                            ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                >
                    Pending Books
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'all'
                            ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                >
                    All Books
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'users'
                            ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                >
                    Users
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'error'
                        ? 'bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400'
                        : 'bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            ) : (
                <>
                    {/* Pending Books Tab */}
                    {activeTab === 'pending' && (
                        pendingBooks.length === 0 ? (
                            <div className="card text-center py-12">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    No pending books to review at the moment
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {pendingBooks.map((book) => (
                                    <div key={book._id} className="card">
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2">
                                                <h3 className="text-2xl font-bold mb-2">{book.title}</h3>
                                                <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-4">
                                                    by {book.author}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                                                    {book.description}
                                                </p>
                                                {book.fileName && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        📎 File: {book.fileName} ({(book.fileSize / (1024 * 1024)).toFixed(2)} MB)
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Uploaded by: {book.uploadedBy.name} ({book.uploadedBy.email})
                                                    <br />
                                                    Submitted: {new Date(book.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex md:flex-col gap-3 md:justify-center">
                                                <button
                                                    onClick={() => handleApprove(book._id)}
                                                    className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(book._id)}
                                                    className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                                                >
                                                    ✗ Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* All Books Tab */}
                    {activeTab === 'all' && (
                        <div className="grid gap-4">
                            {allBooks.map((book) => (
                                <div key={book._id} className="card">
                                    {editingBook?._id === book._id ? (
                                        <div className="space-y-4">
                                            <input
                                                className="input-field"
                                                value={editingBook.title}
                                                onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                                                placeholder="Title"
                                            />
                                            <input
                                                className="input-field"
                                                value={editingBook.author}
                                                onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                                                placeholder="Author"
                                            />
                                            <textarea
                                                className="input-field"
                                                rows="3"
                                                value={editingBook.description}
                                                onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                                                placeholder="Description"
                                            />
                                            <select
                                                className="input-field"
                                                value={editingBook.status}
                                                onChange={(e) => setEditingBook({ ...editingBook, status: e.target.value })}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateBook(book._id, editingBook)}
                                                    className="btn-primary"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingBook(null)}
                                                    className="btn-secondary"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold">{book.title}</h3>
                                                <p className="text-primary-600 dark:text-primary-400">by {book.author}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Status: <span className={`font-medium ${book.status === 'approved' ? 'text-green-600' :
                                                            book.status === 'rejected' ? 'text-red-600' :
                                                                'text-yellow-600'
                                                        }`}>{book.status}</span>
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingBook(book)}
                                                    className="btn-secondary text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <>
                            <div className="mb-6 flex gap-4">
                                <input
                                    type="text"
                                    className="input-field flex-1"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearchUsers()}
                                />
                                <button onClick={handleSearchUsers} className="btn-primary">
                                    Search
                                </button>
                                <button onClick={() => { setSearchQuery(''); fetchData(); }} className="btn-secondary">
                                    Clear
                                </button>
                            </div>
                            <div className="grid gap-4">
                                {users.map((u) => (
                                    <div key={u._id} className="card flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold">{u.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{u.email}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                                Role: <span className="font-medium">{u.role}</span>
                                                {' • '}
                                                Joined: {new Date(u.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {u._id !== user._id && (
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                            >
                                                Delete User
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPanel;
