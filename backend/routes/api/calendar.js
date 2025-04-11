const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

// Mock data for development (until Google OAuth is fully implemented)
const mockEvents = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    description: 'Weekly team sync to discuss project progress',
    location: 'Conference Room A'
  },
  {
    id: '2',
    title: 'Client Call',
    start: new Date(new Date().setHours(13, 30, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    description: 'Discuss project requirements with client',
    location: 'Zoom'
  },
  {
    id: '3',
    title: 'Review Design Mockups',
    start: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    description: 'Review and provide feedback on design mockups',
    location: null
  }
];

// Get calendar events
router.get('/events', async (req, res) => {
  try {
    // In production, use Google Calendar API
    // const oauth2Client = new OAuth2(
    //   process.env.GCAL_CLIENT_ID,
    //   process.env.GCAL_CLIENT_SECRET,
    //   'http://localhost:5000/api/auth/google/callback'
    // );
    
    // oauth2Client.setCredentials({
    //   refresh_token: req.user.refreshToken // Assuming you have user auth
    // });
    
    // const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // const response = await calendar.events.list({
    //   calendarId: 'primary',
    //   timeMin: (new Date()).toISOString(),
    //   maxResults: 10,
    //   singleEvents: true,
    //   orderBy: 'startTime',
    // });
    
    // const events = response.data.items.map(event => ({
    //   id: event.id,
    //   title: event.summary,
    //   start: event.start.dateTime || event.start.date,
    //   end: event.end.dateTime || event.end.date,
    //   description: event.description,
    //   location: event.location
    // }));
    
    // For development, use mock data
    return res.json(mockEvents);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return res.status(500).json({ message: 'Error fetching calendar events' });
  }
});

// Create calendar event
router.post('/events', async (req, res) => {
  try {
    const { title, start, end, description, location } = req.body;
    
    // Validate required fields
    if (!title || !start || !end) {
      return res.status(400).json({ message: 'Title, start, and end are required' });
    }
    
    // In production, use Google Calendar API
    // const oauth2Client = new OAuth2(
    //   process.env.GCAL_CLIENT_ID,
    //   process.env.GCAL_CLIENT_SECRET,
    //   'http://localhost:5000/api/auth/google/callback'
    // );
    
    // oauth2Client.setCredentials({
    //   refresh_token: req.user.refreshToken // Assuming you have user auth
    // });
    
    // const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // const event = {
    //   summary: title,
    //   description,
    //   location,
    //   start: {
    //     dateTime: start,
    //     timeZone: 'America/New_York',
    //   },
    //   end: {
    //     dateTime: end,
    //     timeZone: 'America/New_York',
    //   },
    // };
    
    // const response = await calendar.events.insert({
    //   calendarId: 'primary',
    //   resource: event,
    // });
    
    // For development, return mock data
    const newEvent = {
      id: Date.now().toString(),
      title,
      start,
      end,
      description,
      location
    };
    
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return res.status(500).json({ message: 'Error creating calendar event' });
  }
});

module.exports = router; 