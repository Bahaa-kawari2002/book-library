import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-dark-card shadow-md sticky top-0 z-50 transition-colors duration-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="text-3xl">📚</div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                            Lumina Book Hub
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/" className="btn-secondary">
                                    Browse Books
                                </Link>
                                <Link to="/upload" className="btn-secondary">
                                    Upload Book
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="btn-primary">
                                        Admin Panel
                                    </Link>
                                )}
                                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Hello, <span className="font-semibold">{user.name}</span>
                                    </span>
                                    <button onClick={handleLogout} className="btn-secondary">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Register
                                </Link>
                            </>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-dark-bg hover:bg-gray-300 dark:hover:bg-dark-hover transition-all duration-200"
                            aria-label="Toggle theme"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
