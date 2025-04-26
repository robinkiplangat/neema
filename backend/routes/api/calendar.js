const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const User = require('../../models/User'); // Adjust path if needed

// Use environment variables intended for backend
const GCAL_CLIENT_ID = process.env.GCAL_CLIENT_ID;
const GCAL_CLIENT_SECRET = process.env.GCAL_CLIENT_SECRET;
const GCAL_REDIRECT_URI = process.env.GCAL_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'; // Example

// Function to get OAuth2 client for a request using the user from middleware
const getOauthClient = (req) => {
  if (!req.dbUser) {
      console.error('Middleware error: req.dbUser not found in getOauthClient.');
      throw new Error('User data not available in request.');
  }
  
  const oauth2Client = new OAuth2(
    GCAL_CLIENT_ID,
    GCAL_CLIENT_SECRET,
    GCAL_REDIRECT_URI
  );

  // --- Retrieve Token from req.dbUser --- 
  const userRefreshToken = req.dbUser.integrations?.google?.refreshToken;
  // --- End Token Retrieval --- 

  if (userRefreshToken) {
    oauth2Client.setCredentials({
      refresh_token: userRefreshToken,
    });
  } else {
    console.warn(`User ${req.dbUser.clerkId} does not have a Google refresh token.`);
    // You might throw an error here or handle it in the route
    // throw new Error('User not authenticated with Google Calendar'); 
  }
  return oauth2Client;
};

// Middleware to handle token errors gracefully
const handleGoogleApiError = (err, res, clerkUserId) => {
    console.error(`Google Calendar API Error for user ${clerkUserId}:`, err.message);
    if (err.code === 401 || (err.response && err.response.status === 401) || (err.message && err.message.includes('invalid_grant'))) {
        // Indicates an authentication problem (expired/revoked token)
        // Clear the invalid token from the user database
        User.findOneAndUpdate({ clerkId: clerkUserId }, {
             $set: { 'integrations.google.connected': false },
             $unset: { 'integrations.google.refreshToken': '' } 
            }, { new: true })
            .catch(updateErr => console.error(`Failed to clear invalid Google token for user ${clerkUserId}:`, updateErr));
            
        res.status(401).json({ message: 'Google authentication error. Please reconnect your calendar.' });
    } else if (err.code === 403 || (err.response && err.response.status === 403)) {
        res.status(403).json({ message: 'Permission denied for Google Calendar operation.', details: err.message });
    } else {
        res.status(500).json({ message: 'Error communicating with Google Calendar.', details: err.message });
    }
};

// === Google OAuth Routes (Example - Implement if doing server-side flow) ===
// These would typically live in a separate auth route file

// GET /api/auth/google - Redirect user to Google consent screen
router.get('/auth/google', (req, res) => {
    if (!req.dbUser) return res.status(401).send('Auth required');
    const oauth2Client = new OAuth2(GCAL_CLIENT_ID, GCAL_CLIENT_SECRET, GCAL_REDIRECT_URI);
    const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly', // Read events
        'https://www.googleapis.com/auth/calendar.events',   // Create/edit events
        'openid', // Get user info
        'email',
        'profile'
        // Add other scopes like Gmail if needed
    ];
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Request refresh token
        scope: scopes,
        prompt: 'consent', // Force consent screen for refresh token
        state: req.dbUser.clerkId // Use Clerk ID as state to link callback to user (optional but useful)
    });
    res.redirect(url);
});

// GET /api/auth/google/callback - Handle callback from Google
router.get('/auth/google/callback', async (req, res) => {
    const { code, state } = req.query;
    const clerkId = state; // Retrieve clerkId from state

    if (!clerkId) {
        return res.status(400).send('Invalid state parameter from Google callback.');
    }

    try {
        const oauth2Client = new OAuth2(GCAL_CLIENT_ID, GCAL_CLIENT_SECRET, GCAL_REDIRECT_URI);
        const { tokens } = await oauth2Client.getToken(code);
        
        if (!tokens.refresh_token) {
             console.warn(`Refresh token not received from Google for user ${clerkId}. User might have already granted offline access.`);
             // If you only get an access_token, you might need to handle that,
             // but for long-term access, the refresh_token is key.
             // If you previously stored a refresh token, you might not need to do anything here.
        }

        // --- Store Token --- 
        const updateData = {
            'integrations.google.connected': true,
            // Store refresh token only if received
            ...(tokens.refresh_token && { 'integrations.google.refreshToken': tokens.refresh_token })
        };
        
        const updatedUser = await User.findOneAndUpdate(
            { clerkId: clerkId }, 
            { $set: updateData },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).send('User not found in database during Google callback.');
        }
        
        console.log(`Stored/Updated Google refresh token for user ${clerkId}`);
        // --- End Store Token --- 

        // Redirect user back to frontend (e.g., settings page)
        res.redirect('/dashboard/integrations?success=google'); // Adjust frontend URL

    } catch (error) {
        console.error('Error exchanging Google code for token:', error);
        res.status(500).redirect('/dashboard/integrations?error=google_token'); // Redirect with error
    }
});

// === API Routes ===

// GET calendar events
router.get('/events', async (req, res) => {
  try {
    const oauth2Client = getOauthClient(req); // Uses req.dbUser implicitly
    if (!req.dbUser.isIntegrationConnected('google') || !oauth2Client.credentials.refresh_token) {
        return res.status(401).json({ message: 'Google Calendar connection required.'});
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const timeMin = req.query.start || (new Date()).toISOString();
    const timeMax = req.query.end;
    const maxResults = parseInt(req.query.maxResults || '50', 10);

    const params = { calendarId: 'primary', timeMin, maxResults, singleEvents: true, orderBy: 'startTime' };
    if (timeMax) { params.timeMax = timeMax; }

    const response = await calendar.events.list(params);

    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary || 'No Title',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      description: event.description,
      location: event.location,
      attendees: event.attendees,
      status: event.status,
      htmlLink: event.htmlLink
    }));
    res.json(events);

  } catch (error) {
    handleGoogleApiError(error, res, req.dbUser?.clerkId);
  }
});

// POST create calendar event
router.post('/events', async (req, res) => {
  try {
    const oauth2Client = getOauthClient(req);
    if (!req.dbUser.isIntegrationConnected('google') || !oauth2Client.credentials.refresh_token) {
        return res.status(401).json({ message: 'Google Calendar connection required.'});
    }

    const { title, start, end, description, location, attendees } = req.body;
    if (!title || !start || !end) {
      return res.status(400).json({ message: 'Title, start date/time, and end date/time are required' });
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const eventResource = {
      summary: title,
      description: description,
      location: location,
      start: {
        dateTime: start.includes('T') ? start : undefined,
        date: start.includes('T') ? undefined : start,
        timeZone: req.dbUser?.preferences?.timezone || 'America/New_York', // Use user timezone if available
      },
      end: {
        dateTime: end.includes('T') ? end : undefined,
        date: end.includes('T') ? undefined : end,
        timeZone: req.dbUser?.preferences?.timezone || 'America/New_York',
      },
      attendees: attendees,
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: eventResource,
      sendNotifications: true,
    });

    const createdEvent = {
      id: response.data.id,
      title: response.data.summary,
      start: response.data.start?.dateTime || response.data.start?.date,
      end: response.data.end?.dateTime || response.data.end?.date,
      description: response.data.description,
      location: response.data.location,
      attendees: response.data.attendees,
      status: response.data.status,
      htmlLink: response.data.htmlLink
    };
    res.status(201).json(createdEvent);

  } catch (error) {
     handleGoogleApiError(error, res, req.dbUser?.clerkId);
  }
});

// POST /api/calendar/disconnect - Disconnect Google Calendar
router.post('/disconnect', async (req, res) => {
    if (!req.dbUser) return res.status(401).send('Auth required');
    const clerkId = req.dbUser.clerkId;
    try {
        // Optionally: Revoke the token via Google API 
        // const refreshToken = req.dbUser.integrations?.google?.refreshToken;
        // if (refreshToken) { 
        //    const oauth2Client = getOauthClient(req);
        //    await oauth2Client.revokeToken(refreshToken);
        //    console.log(`Revoked Google token for user ${clerkId}`);
        // }

        // Remove token info from DB
        await User.findOneAndUpdate({ clerkId: clerkId }, {
             $set: { 'integrations.google.connected': false },
             $unset: { 'integrations.google.refreshToken': '' } 
            });
        console.log(`Disconnected Google Calendar for user ${clerkId}`);
        res.json({ success: true });
    } catch (error) {
        console.error(`Error disconnecting Google Calendar for user ${clerkId}:`, error);
        res.status(500).json({ message: 'Failed to disconnect Google Calendar.' });
    }
});


module.exports = router;
