const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// More strict rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs for AI endpoints
});

// --- Routes --- 

// Core Feature Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', aiLimiter, require('./routes/ai'));

// Integration Routes (Calendar, Notion, LinkedIn)
app.use('/api/calendar', require('./routes/api/calendar')); // Existing calendar route
app.use('/integrations/notion', require('./routes/notion')); // Add Notion routes
app.use('/integrations/linkedin', require('./routes/linkedin')); // Add LinkedIn routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date() });
});

// --- Error Handling --- 
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Basic error handling, consider more specific checks
  if (err.message && err.message.includes('token')) {
      // Handle potential auth errors slightly differently
      res.status(401).json({ error: 'Authentication Error', message: err.message });
  } else {
      res.status(500).json({
        error: 'Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
      });
  }
});

module.exports = app;