import axios from 'axios';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch calendar events
 */
export const fetchCalendarEvents = async (startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> => {
  try {
    const params = new URLSearchParams();
    
    if (startDate) {
      params.append('start', startDate.toISOString());
    }
    
    if (endDate) {
      params.append('end', endDate.toISOString());
    }
    
    const url = `${API_BASE_URL}/api/calendar/events${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await axios.get(url);
    
    // Check response type and handle accordingly
    if (response.headers['content-type']?.includes('application/json')) {
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error('Expected array of events, got:', response.data);
        return [];
      }
    } else {
      console.error('Received non-JSON response:', response.headers['content-type']);
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Calendar API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
    } else {
      console.error('Error fetching calendar events:', error);
    }
    return [];
  }
};

/**
 * Create a calendar event
 */
export const createCalendarEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {
  try {
    const response = await axios.post('/api/calendar/events', event);
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return null;
  }
};

/**
 * Fetch today's events
 */
export const fetchTodayEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await fetchCalendarEvents(today, tomorrow);
  } catch (error) {
    console.error('Error fetching today\'s events:', error);
    return [];
  }
}; 