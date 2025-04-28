import api from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY;
const CALENDAR_API_KEY = import.meta.env.VITE_CALENDAR_API_KEY;

export interface Participant {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  status?: 'accepted' | 'declined' | 'tentative' | 'pending';
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  isAllDay?: boolean;
  recurrence?: string;
  participants?: Participant[];
  userId: string;
  calendarId?: string;
  color?: string;
  isEditable?: boolean;
}

// Optionally, add X-Calendar-API-Key to each request if your backend requires it.
// Otherwise, rely on the shared api instance for Clerk JWT auth.

export const fetchEvents = async (
  userId: string,
  start?: Date,
  end?: Date,
  calendarIds?: string[]
): Promise<CalendarEvent[]> => {
  try {
    const response = await api.get(`/events`, {
      params: {
        userId,
        start: start?.toISOString(),
        end: end?.toISOString(),
        calendarIds: calendarIds?.join(',')
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const fetchEventById = async (eventId: string): Promise<CalendarEvent | null> => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event by id:', error);
    return null;
  }
};

export const fetchTodayEvents = async (userId: string): Promise<CalendarEvent[]> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return fetchEvents(userId, today, tomorrow);
};

export const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {
  try {
    const response = await api.post(`/events`, event);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
};

export const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
  try {
    const response = await api.put(`/events/${eventId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    await api.delete(`/events/${eventId}`);
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
};

export const addParticipantToEvent = async (
  eventId: string,
  participant: Omit<Participant, 'id'>
): Promise<boolean> => {
  try {
    await api.post(`/events/${eventId}/participants`, participant);
    return true;
  } catch (error) {
    console.error('Error adding participant to event:', error);
    return false;
  }
};

export const fetchUserCalendars = async (userId: string): Promise<{ id: string; name: string; color: string }[]> => {
  try {
    const response = await api.get(`/calendars`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user calendars:', error);
    return [];
  }
};

export const suggestMeetingTimes = async (
  participants: string[],
  durationMinutes: number,
  earliestDate: Date,
  latestDate: Date
): Promise<{ start: string; end: string }[]> => {
  try {
    const response = await api.post(`/events/suggest-times`, {
      participants,
      durationMinutes,
      earliestDate: earliestDate.toISOString(),
      latestDate: latestDate.toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error suggesting meeting times:', error);
    return [];
  }
}; 