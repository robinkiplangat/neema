import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Calendar, Linkedin, Star, Clock, MoreVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  tags?: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  participants?: { name: string; email: string; avatar?: string }[];
}

const CommunicationTabContent = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [emails, setEmails] = useState<Email[]>([
    {
      id: "1",
      sender: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      subject: "Neema Investment Opportunity",
      preview: "I'd like to discuss the opportunity to invest in your startup...",
      time: "10:30 AM",
      isRead: false,
      isStarred: true,
      tags: ["Important", "Investment"],
    },
    {
      id: "2",
      sender: {
        name: "David Chen",
        email: "david@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      subject: "UI Design Feedback",
      preview: "Here's my feedback on the dashboard design we discussed yesterday...",
      time: "Yesterday",
      isRead: true,
      isStarred: false,
      tags: ["Design"],
    },
    {
      id: "3",
      sender: {
        name: "Alex Rivera",
        email: "alex@example.com",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      subject: "Partnership Proposal",
      preview: "Our company would be interested in exploring integration possibilities...",
      time: "Yesterday",
      isRead: false,
      isStarred: false,
      tags: ["Partnership"],
    },
    {
      id: "4",
      sender: {
        name: "Morgan Williams",
        email: "morgan@example.com",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      subject: "Meeting Follow-up",
      preview: "Thank you for the productive meeting today. Here are the next steps...",
      time: "Sep 5",
      isRead: true,
      isStarred: true,
      tags: ["Follow-up"],
    },
  ]);

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Investor Call",
      start: "2023-09-10T14:00:00",
      end: "2023-09-10T15:00:00",
      location: "Zoom",
      participants: [
        {
          name: "Sarah Johnson",
          email: "sarah@example.com",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
      ],
    },
    {
      id: "2",
      title: "Team Weekly Sync",
      start: "2023-09-11T10:00:00",
      end: "2023-09-11T11:00:00",
      location: "Conference Room A",
      participants: [
        {
          name: "David Chen",
          email: "david@example.com",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
        {
          name: "Alex Rivera",
          email: "alex@example.com",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
      ],
    },
    {
      id: "3",
      title: "Product Demo",
      start: "2023-09-12T15:30:00",
      end: "2023-09-12T16:30:00",
      location: "Client Office",
      participants: [
        {
          name: "Morgan Williams",
          email: "morgan@example.com",
          avatar: "https://i.pravatar.cc/150?img=4",
        },
      ],
    },
  ]);

  const toggleEmailStar = (emailId: string) => {
    setEmails(
      emails.map((email) =>
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      )
    );
  };

  const markEmailAsRead = (emailId: string) => {
    setEmails(
      emails.map((email) =>
        email.id === emailId ? { ...email, isRead: true } : email
      )
    );
  };

  // Format date for calendar display
  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get today's events
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-4">
            <TabsList className="bg-transparent h-14">
              <TabsTrigger 
                value="email" 
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-neema-primary rounded-none h-14 px-4"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
                <Badge variant="secondary" className="ml-1">{emails.filter(e => !e.isRead).length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-neema-primary rounded-none h-14 px-4"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-neema-primary rounded-none h-14 px-4"
              >
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
                <Badge variant="secondary" className="ml-1">{todayEvents.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="linkedin" 
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-neema-primary rounded-none h-14 px-4"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <div className="flex items-center mb-4 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-9"
                />
              </div>
              <Button variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button>
                {activeTab === "email" && <Mail className="h-4 w-4 mr-2" />}
                {activeTab === "messages" && <MessageSquare className="h-4 w-4 mr-2" />}
                {activeTab === "calendar" && <Calendar className="h-4 w-4 mr-2" />}
                {activeTab === "linkedin" && <Linkedin className="h-4 w-4 mr-2" />}
                Compose
              </Button>
            </div>

            <TabsContent value="email" className="mt-0">
              <div className="space-y-1">
                {emails.map((email) => (
                  <div 
                    key={email.id}
                    className={`flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 cursor-pointer ${
                      !email.isRead ? "bg-pastel-lightpink/10 font-medium" : ""
                    }`}
                    onClick={() => markEmailAsRead(email.id)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEmailStar(email.id);
                      }}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          email.isStarred ? "text-amber-400 fill-amber-400" : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                    
                    <Avatar className="mt-1">
                      <AvatarImage src={email.sender.avatar} />
                      <AvatarFallback>{email.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium truncate">{email.sender.name}</p>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">{email.time}</p>
                      </div>
                      <p className="truncate">{email.subject}</p>
                      <p className="text-sm text-muted-foreground truncate">{email.preview}</p>
                      {email.tags && email.tags.length > 0 && (
                        <div className="flex gap-2 mt-1">
                          {email.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="messages" className="mt-0">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <p>Connect your messaging apps to see messages here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Today's Schedule</h3>
                
                {todayEvents.length > 0 ? (
                  <div className="space-y-3">
                    {todayEvents.map((event) => (
                      <div key={event.id} className="flex gap-4 p-3 border rounded-md">
                        <div className="min-w-[60px] text-center">
                          <p className="text-sm font-medium">{formatEventTime(event.start)}</p>
                          <p className="text-xs text-muted-foreground">to</p>
                          <p className="text-sm font-medium">{formatEventTime(event.end)}</p>
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-medium">{event.title}</p>
                          {event.location && (
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                          )}
                          
                          {event.participants && event.participants.length > 0 && (
                            <div className="flex mt-2">
                              {event.participants.map((participant, index) => (
                                <Avatar key={index} className="h-6 w-6 border-2 border-background" style={{ marginLeft: index > 0 ? "-8px" : "0" }}>
                                  <AvatarImage src={participant.avatar} />
                                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                              <p className="text-xs text-muted-foreground ml-2 self-center">
                                {event.participants.length} participant{event.participants.length > 1 ? "s" : ""}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <Button variant="outline" size="sm" className="self-start">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-muted-foreground">
                    <p>No events scheduled for today</p>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Full Calendar
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="linkedin" className="mt-0">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <p>Connect your LinkedIn account to manage connections here</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunicationTabContent; 