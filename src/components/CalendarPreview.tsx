import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { fetchTodayEvents, CalendarEvent } from '@/services/googleCalendarService';

const CalendarPreview = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        const todayEvents = await fetchTodayEvents();
        setEvents(todayEvents);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, []);

  // Function to format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="border shadow-sm bg-white/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Calendar Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neema-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No events scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50">
                <div className="bg-pastel-sky/20 text-neema-primary p-2 rounded-md">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </p>
                  {event.location && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarPreview; 