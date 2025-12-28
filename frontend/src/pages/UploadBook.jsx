import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const UploadBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (50MB max)
            if (file.size > 50 * 1024 * 1024) {
                setError('File size must be less than 50MB');
                setSelectedFile(null);
                e.target.value = '';
                return;
            }
            setSelectedFile(file);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('description', formData.description);

            if (selectedFile) {
                formDataToSend.append('bookFile', selectedFile);
            }

            await api.post('/books', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess('Book uploaded successfully! It will appear in the library once approved by an admin.');
            setFormData({ title: '', author: '', description: '' });
            setSelectedFile(null);

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload book');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold mb-4">Please login to upload books</h2>
                <button onClick={() => navigate('/login')} className="btn-primary">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="card">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">📖</div>
                        <h2 className="text-3xl font-bold mb-2">Upload a New Book</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Share your favorite books with the community
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Book Title *</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Enter book title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Author *</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                required
                                placeholder="Enter author name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description *</label>
                            <textarea
                                className="input-field resize-none"
                                rows="6"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                placeholder="Enter book description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Upload Book File (Optional)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="file"
                                    accept=".pdf,.epub,.mobi,.txt,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-900 dark:text-gray-100
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-600 file:text-white
                    hover:file:bg-primary-700
                    file:cursor-pointer cursor-pointer
                    bg-gray-50 dark:bg-dark-bg
                    border border-gray-300 dark:border-gray-600
                    rounded-lg"
                                />
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Accepted formats: PDF, EPUB, MOBI, TXT, DOC, DOCX (Max 50MB)
                                </p>
                                {selectedFile && (
                                    <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                                        ✓ Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Uploading...' : 'Upload Book'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="flex-1 btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadBook;
