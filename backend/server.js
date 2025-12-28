const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware - CORS Configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        // Create default admin user if not exists
        createDefaultAdmin();
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Create default admin user
const createDefaultAdmin = async () => {
    try {
        const User = require('./models/User');
        const adminExists = await User.findOne({ email: 'admin@luminabooks.com' });

        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@luminabooks.com',
                password: 'Admin@123',
                role: 'admin'
            });
            console.log('✅ Default admin account created');
            console.log('📧 Email: admin@luminabooks.com');
            console.log('🔑 Password: Admin@123');
        }
    } catch (error) {
        console.error('Error creating admin:', error.message);
    }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/users', require('./routes/users'));

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Lumina Book Hub API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Lumina Book Hub Backend`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
