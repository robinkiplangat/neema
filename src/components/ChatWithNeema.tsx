import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Calendar, FileText, Linkedin } from 'lucide-react';
import * as aiService from '@/services/aiService';
import * as notionService from '@/services/notionService';
import * as calendarService from '@/services/googleCalendarService';
import * as linkedInService from '@/services/linkedInService';

interface Message {
  sender: 'User' | 'Neema';
  text: string;
}

const ChatWithNeema = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'Neema', text: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<calendarService.CalendarEvent[]>([]);
  const [notionNotes, setNotionNotes] = useState<notionService.NotionNote[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  // Set up speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      
      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };
      
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Fetch calendar events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      const events = await calendarService.fetchTodayEvents();
      setCalendarEvents(events);
    };
    
    fetchEvents();
  }, []);

  // Fetch Notion notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await notionService.fetchNotionNotes();
      setNotionNotes(notes);
    };
    
    fetchNotes();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!recognition.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { sender: 'User', text: userMessage }]);
      setInput('');
      setIsLoading(true);

      try {
        // Convert messages to the format expected by the AI service
        const chatHistory = messages.map(msg => ({
          role: msg.sender === 'User' ? 'user' as const : 'assistant' as const,
          content: msg.text
        }));

        const response = await aiService.generateResponse(userMessage, chatHistory);
        
        // Process special commands
        if (userMessage.toLowerCase().includes('calendar') || userMessage.toLowerCase().includes('schedule')) {
          // Fetch calendar data if asked about calendar
          const events = await calendarService.fetchTodayEvents();
          setCalendarEvents(events);
          
          let eventText = 'Here are your events for today:\n';
          if (events.length === 0) {
            eventText = 'You have no events scheduled for today.';
          } else {
            events.forEach(event => {
              const start = new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              eventText += `• ${start} - ${event.title}\n`;
            });
          }
          
          setMessages(prev => [...prev, { sender: 'Neema', text: response }, { sender: 'Neema', text: eventText }]);
        } else if (userMessage.toLowerCase().includes('notion') || userMessage.toLowerCase().includes('notes')) {
          // Fetch Notion data if asked about notes
          const notes = await notionService.fetchNotionNotes();
          setNotionNotes(notes);
          
          let notesText = 'Here are your recent notes:\n';
          if (notes.length === 0) {
            notesText = 'You don\'t have any notes yet.';
          } else {
            notes.forEach(note => {
              notesText += `• ${note.title}\n`;
            });
          }
          
          setMessages(prev => [...prev, { sender: 'Neema', text: response }, { sender: 'Neema', text: notesText }]);
        } else {
          setMessages(prev => [...prev, { sender: 'Neema', text: response }]);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        setMessages(prev => [...prev, { sender: 'Neema', text: 'Sorry, I encountered an error. Please try again.' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Chat with Neema</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0">
        <div className="flex-1 overflow-y-auto mb-4 bg-background rounded-md p-3 shadow-inner">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-3 p-2 rounded-lg ${
                msg.sender === 'Neema' 
                  ? 'bg-pastel-lilac/20 text-left' 
                  : 'bg-pastel-sky/20 text-right'
              }`}
            >
              <div className="text-xs font-medium text-muted-foreground mb-1">{msg.sender}</div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-3 p-2 rounded-lg bg-pastel-lilac/20 text-left">
              <div className="text-xs font-medium text-muted-foreground mb-1">Neema</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-neema-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-neema-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-neema-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center mt-auto">
          <Button 
            type="button" 
            variant="ghost" 
            className="h-10 w-10 p-0 mr-2"
            onClick={toggleListening}
          >
            {isListening ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 mr-2"
            disabled={isListening}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWithNeema; 