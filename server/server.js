require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173', // frontend URL
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Improved MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout
  connectTimeoutMS: 30000, // Increase connect timeout
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    // Don't exit the process immediately, log the error and continue
    // This allows the server to start even with DB connection issues
  });

// Add connection error handler for future connection issues
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err.message);
});

// Add reconnect handler
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/semesters', require('./routes/semester'));
app.use('/api/labs', require('./routes/lab'));
app.use('/api/documents', require('./routes/document'));
app.use('/api/exec', require('./routes/exec'));
app.use('/api/analytics', require('./routes/analytics'));

// Simple health check endpoint that doesn't need DB
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));