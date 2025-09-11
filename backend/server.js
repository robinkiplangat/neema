const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = require('./app'); // Use the app imported from ./app.js

const PORT = process.env.PORT || 5000;

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:8080', // Your local dev frontend
  'https://neema.ch3ruiyotai.space' // Your production frontend
  // Add any other origins if needed
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // If you need to send cookies or authorization headers
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', /* other headers */], // Allowed headers
};

// Apply CORS middleware to the imported app
app.use(cors(corsOptions));
// Enable preflight requests for all routes
app.options('*', cors(corsOptions));
// --- End CORS Configuration ---

// Remove the redundant declaration: const app = express();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});