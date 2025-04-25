const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

// TODO: Configure OAuth2 client - Ensure these are set in your environment variables
const oauth2Client = new OAuth2(
  process.env.GCAL_CLIENT_ID,
  process.env.GCAL_CLIENT_SECRET,
  process.env.GCAL_REDIRECT_URI // e.g., 'http://localhost:5000/api/auth/google/callback'
);

// Middleware to set credentials for the user (replace with your actual auth logic)
// This assumes you have middleware that attaches the user object (with tokens) to req
const setUserCredentials = async (req, res, next) => {
  // TODO: Replace this with actual logic to retrieve the user's stored refresh token
  // This might involve querying your database based on req.user.id or similar
  const userRefreshToken = req.user?.googleRefreshToken; // Example: Get refresh token from user object

  if (!userRefreshToken) {
    // If no token, maybe redirect to auth or return an error
    // For now, we'll proceed, but API calls will likely fail without auth
    // return res.status(401).json({ message: 'User not authenticated with Google Calendar' });
    console.warn('No Google refresh token found for user. API calls may fail.');
    // You might want to handle this more gracefully, e.g., by initiating the OAuth flow
  } else {
      oauth2Client.setCredentials({
        refresh_token: userRefreshToken,
      });
      // Refresh the access token if necessary (googleapis library often handles this automatically)
      try {
         // Optionally force a refresh token request to get a new access token
         // await oauth2Client.getAccessToken();
         // console.log('Google Access Token refreshed successfully.');
      } catch (error) {
         console.error('Error refreshing Google access token:', error.message);
         // Handle token refresh errors (e.g., token revoked)
         // Maybe clear the stored token and prompt re-authentication
         return res.status(401).json({ message: 'Failed to refresh Google token. Please re-authenticate.' });
      }
  }
  next();
};

// Apply the middleware to all routes in this file
router.use(setUserCredentials);

// Get calendar events
router.get('/events', async (req, res) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Basic parameters - adjust as needed (e.g., based on req.query for date ranges)
    const timeMin = req.query.start || (new Date()).toISOString();
    const timeMax = req.query.end; // Optional end date
    const maxResults = req.query.maxResults || 10;

    const params = {
        calendarId: 'primary',
        timeMin: timeMin,
        maxResults: parseInt(maxResults, 10),
        singleEvents: true,
        orderBy: 'startTime',
    };

    if (timeMax) {
        params.timeMax = timeMax;
    }

    const response = await calendar.events.list(params);

    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary || 'No Title',
      start: event.start?.dateTime || event.start?.date, // Handle all-day events
      end: event.end?.dateTime || event.end?.date,     // Handle all-day events
      description: event.description,
      location: event.location,
      // Add other relevant fields: attendees, status, etc.
    }));

    res.json(events);
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error.message);
    // Check for specific auth errors if needed
    if (error.message && error.message.includes('invalid_grant')) {
        // This often means the refresh token is bad or revoked
        // TODO: Implement logic to clear the user's stored token and prompt re-auth
        return res.status(401).json({ message: 'Google authentication error. Please reconnect your calendar.' });
    }
    res.status(500).json({ message: 'Error fetching Google Calendar events' });
  }
});

// Create calendar event
router.post('/events', async (req, res) => {
  try {
    const { title, start, end, description, location } = req.body;

    // Validate required fields (add more validation as needed)
    if (!title || !start || !end) {
      return res.status(400).json({ message: 'Title, start, and end are required' });
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: title,
      description: description,
      location: location,
      start: {
        dateTime: start, // Assuming start is in ISO format e.g., '2024-07-28T10:00:00-04:00'
        // TODO: Determine TimeZone dynamically or from user settings
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: end, // Assuming end is in ISO format
        timeZone: 'America/New_York',
      },
      // Add other fields like attendees if needed
      // attendees: [{ email: 'user@example.com' }],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    // Map the created event to the format expected by the frontend
    const createdEvent = {
      id: response.data.id,
      title: response.data.summary,
      start: response.data.start?.dateTime || response.data.start?.date,
      end: response.data.end?.dateTime || response.data.end?.date,
      description: response.data.description,
      location: response.data.location,
    };

    res.status(201).json(createdEvent);

  } catch (error) {
    console.error('Error creating Google Calendar event:', error.message);
     if (error.message && error.message.includes('invalid_grant')) {
        return res.status(401).json({ message: 'Google authentication error. Please reconnect your calendar.' });
    }
    res.status(500).json({ message: 'Error creating Google Calendar event' });
  }
});

// TODO: Add routes for updating and deleting events if needed

module.exports = router;
