const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { requireAuthAndLoadUser } = require('./middleware/auth'); // Import the middleware

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors()); // Configure CORS properly for your frontend URL in production
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// More strict rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 
});

// --- Routes --- 

// Public routes (like health check, maybe parts of users for signup?)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date() });
});

// Devices registration route (no auth required)
app.use('/api/devices', require('./routes/devices'));

// Productivity endpoints (require auth)
app.use('/api/productivity', requireAuthAndLoadUser, require('./routes/productivity'));

// Routes requiring authentication
// Apply the middleware BEFORE these routes
app.use('/api/tasks', requireAuthAndLoadUser, require('./routes/tasks'));
app.use('/api/projects', requireAuthAndLoadUser, require('./routes/projects'));
app.use('/api/notes', requireAuthAndLoadUser, require('./routes/notes'));
app.use('/api/users', requireAuthAndLoadUser, require('./routes/users')); // User routes might need auth for profile updates etc.
app.use('/api/ai', requireAuthAndLoadUser, aiLimiter, require('./routes/ai'));

// Integration Routes (also require auth)
app.use('/api/calendar', requireAuthAndLoadUser, require('./routes/api/calendar')); 
app.use('/integrations/notion', requireAuthAndLoadUser, require('./routes/notion')); 
app.use('/integrations/linkedin', requireAuthAndLoadUser, require('./routes/linkedin')); 

// --- Error Handling --- 
// Note: Clerk's default error handler might catch auth errors before this.
// Consider adding specific Clerk error handling if needed.
app.use((err, req, res, next) => {
  console.error("[Global Error Handler]");
  console.error(err);

  // Check for Clerk specific errors
  if (err.name === 'ClerkAPIError') {
      return res.status(err.status || 500).json({ message: err.message, errors: err.errors });
  }
  if (err.message && (err.message.toLowerCase().includes('unauthenticated') || err.message.toLowerCase().includes('unauthorized'))) {
       return res.status(401).json({ message: 'Authentication required.' });
  }

  // General error handling
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || 'ServerError',
    message: err.message || 'An unexpected error occurred'
  });
});

module.exports = app;