import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Mail, MessageSquare, Calendar, Linkedin, Star, Clock, MoreVertical, 
  Search, Plus, RefreshCw, Reply, Trash2, Tag, User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import * as emailService from "@/services/emailService";
import * as calendarService from "@/services/calendarService";
import * as aiService from "@/services/aiService";
import { useAI } from "@/context/AIContext";

const CommunicationTabContent = () => {
  const { user } = useUser();
  const userId = user?.id || '';
  const { toast } = useToast();
  const { refreshContext } = useAI();
  
  const [activeTab, setActiveTab] = useState("email");
  const [emails, setEmails] = useState<emailService.Email[]>([]);
  const [events, setEvents] = useState<calendarService.CalendarEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch emails and events when component mounts or active tab changes
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      
      try {
        if (activeTab === "email") {
          const fetchedEmails = await emailService.fetchEmails(userId);
          setEmails(fetchedEmails);
        } else if (activeTab === "calendar") {
          const fetchedEvents = await calendarService.fetchTodayEvents(userId);
          setEvents(fetchedEvents);
        }
      } catch (error) {
        console.error(`Error loading ${activeTab} data:`, error);
        toast({
          title: `Failed to load ${activeTab} data`,
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [userId, activeTab, toast]);
  
  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      if (activeTab === "email") {
        const fetchedEmails = await emailService.fetchEmails(userId);
        setEmails(fetchedEmails);
        
        toast({
          title: "Emails refreshed",
          description: `${fetchedEmails.filter(e => !e.isRead).length} unread emails`
        });
      } else if (activeTab === "calendar") {
        const fetchedEvents = await calendarService.fetchTodayEvents(userId);
        setEvents(fetchedEvents);
        
        toast({
          title: "Calendar refreshed",
          description: `${fetchedEvents.length} events today`
        });
      }
      
      // Refresh AI context
      refreshContext();
    } catch (error) {
      console.error(`Error refreshing ${activeTab} data:`, error);
      toast({
        title: `Failed to refresh ${activeTab} data`,
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmailStar = async (emailId: string, event: React.MouseEvent) => {
    // Prevent the parent click handler from firing
    event.stopPropagation();
    
    try {
      const success = await emailService.toggleEmailStar(emailId);
      
      if (success) {
        setEmails(
          emails.map((email) =>
            email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
          )
        );
      }
    } catch (error) {
      console.error('Error toggling email star:', error);
      toast({
        title: "Failed to update email",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const markEmailAsRead = async (emailId: string) => {
    try {
      const success = await emailService.markEmailAsRead(emailId);
      
      if (success) {
        setEmails(
          emails.map((email) =>
            email.id === emailId ? { ...email, isRead: true } : email
          )
        );
        
        // Refresh AI context
        refreshContext();
      }
    } catch (error) {
      console.error('Error marking email as read:', error);
      toast({
        title: "Failed to update email",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const composeEmail = () => {
    toast({
      title: "Compose email",
      description: "This feature is coming soon"
    });
  };
  
  const scheduleEvent = () => {
    toast({
      title: "Schedule event",
      description: "This feature is coming soon"
    });
  };
  
  const joinEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event && event.location) {
      if (event.location.toLowerCase().includes('zoom')) {
        window.open(`https://zoom.us/join`, '_blank');
      } else if (event.location.toLowerCase().includes('meet')) {
        window.open(`https://meet.google.com/`, '_blank');
      } else {
        toast({
          title: "Join meeting",
          description: `Location: ${event.location}`
        });
      }
    }
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
  
  // Filter emails based on search query
  const filteredEmails = emails.filter(email => 
    searchQuery 
      ? email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        email.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

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
            <div className="flex flex-col sm:flex-row items-center mb-4 gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                {activeTab === "calendar" ? (
                  <Button onClick={scheduleEvent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                ) : (
                  <Button onClick={composeEmail}>
                    {activeTab === "email" && <Mail className="h-4 w-4 mr-2" />}
                    {activeTab === "messages" && <MessageSquare className="h-4 w-4 mr-2" />}
                    {activeTab === "linkedin" && <User className="h-4 w-4 mr-2" />}
                    Compose
                  </Button>
                )}
              </div>
            </div>

            <TabsContent value="email" className="mt-0">
              {isLoading ? (
                // Email loading skeleton
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-md border">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Skeleton className="h-5 w-24 mb-2" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEmails.length > 0 ? (
                <div className="space-y-1">
                  {filteredEmails.map((email) => (
                    <div 
                      key={email.id}
                      className={`flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 cursor-pointer border ${
                        !email.isRead ? "bg-pastel-lightpink/10 font-medium border-pastel-lightpink/30" : "border-transparent"
                      }`}
                      onClick={() => markEmailAsRead(email.id)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => toggleEmailStar(email.id, e)}
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
              ) : searchQuery ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  <p>No emails found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  <p>Your inbox is empty</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="messages" className="mt-0">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <p>Connect your messaging apps to see messages here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Today's Schedule</h3>
                
                {isLoading ? (
                  // Calendar loading skeleton
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 p-3 border rounded-md">
                        <div className="min-w-[60px]">
                          <Skeleton className="h-5 w-16 mb-1" />
                          <Skeleton className="h-3 w-8 mb-1" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 mb-2" />
                          <Skeleton className="h-4 w-32 mb-3" />
                          <div className="flex">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full -ml-1" />
                            <Skeleton className="h-4 w-24 ml-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : todayEvents.length > 0 ? (
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
                        
                        <Button variant="outline" size="sm" className="self-start" onClick={() => joinEvent(event.id)}>
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