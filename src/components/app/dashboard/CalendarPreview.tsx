import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, MapPin, Users } from "lucide-react";

// Mock data for calendar events
const mockEvents = [
  {
    id: "1",
    title: "Client Meeting",
    time: "10:00 AM - 11:00 AM",
    location: "Zoom",
    attendees: ["John Doe", "Jane Smith"],
    isToday: true
  },
  {
    id: "2",
    title: "Team Standup",
    time: "11:30 AM - 12:00 PM",
    location: "Conference Room A",
    attendees: ["Team Members"],
    isToday: true
  },
  {
    id: "3",
    title: "Lunch Break",
    time: "12:30 PM - 1:30 PM",
    location: "",
    attendees: [],
    isToday: true
  },
  {
    id: "4",
    title: "Project Review",
    time: "2:00 PM - 3:00 PM",
    location: "Conference Room B",
    attendees: ["Project Team"],
    isToday: true
  },
  {
    id: "5",
    title: "Product Demo",
    time: "10:00 AM - 11:00 AM",
    location: "Zoom",
    attendees: ["Client Team"],
    isToday: false
  }
];

const CalendarPreview = () => {
  const [activeTab, setActiveTab] = useState<"today" | "upcoming">("today");
  
  const filteredEvents = mockEvents.filter(event => 
    activeTab === "today" ? event.isToday : !event.isToday
  );
  
  return (
    <Card className="border shadow-sm bg-white/80 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </CardTitle>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex border rounded-md mb-4 overflow-hidden">
          <Button 
            variant={activeTab === "today" ? "default" : "ghost"} 
            className="flex-1 rounded-none h-8"
            onClick={() => setActiveTab("today")}
          >
            Today
          </Button>
          <Button 
            variant={activeTab === "upcoming" ? "default" : "ghost"} 
            className="flex-1 rounded-none h-8"
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </Button>
        </div>
        
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="p-3 rounded-md border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">{event.title}</div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{event.time}</span>
              </div>
              {event.location && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.attendees.length > 0 && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{event.attendees.join(", ")}</span>
                </div>
              )}
            </div>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No events found
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="link" className="w-full justify-start text-sm">
            View full calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarPreview; 