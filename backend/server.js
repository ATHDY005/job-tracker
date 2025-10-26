const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      'https://gidyjobtracker.netlify.app',
      'http://localhost:3000',
      'https://gidyjobtracker.netlify.app', // Add your exact domain
    ],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection - SIMPLIFIED
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err.message);
    console.log('💡 Check your MONGODB_URI in .env file');
  });

// Routes
app.use('/api/jobs', require('./routes/jobs'));

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Job Tracker API is working!',
    timestamp: new Date().toISOString(),
  });
});

// Debug route to test database connection
app.get('/api/test-db', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMessages = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    databaseStatus: statusMessages[dbStatus] || 'unknown',
    readyState: dbStatus,
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
