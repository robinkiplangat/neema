import axios from 'axios';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}

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
    
    const url = `/api/calendar/events${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return fetchCalendarEvents(today, tomorrow);
}; 