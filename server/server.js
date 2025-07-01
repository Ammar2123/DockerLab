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
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => process.exit(1));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/semesters', require('./routes/semester'));
app.use('/api/labs', require('./routes/lab'));
app.use('/api/documents', require('./routes/document'));
app.use('/api/exec', require('./routes/exec'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));