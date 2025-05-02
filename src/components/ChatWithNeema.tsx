import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Send, 
  Calendar, 
  FileText, 
  Linkedin, 
  RefreshCw, 
  Settings 
} from 'lucide-react';
import * as aiService from '@/services/aiService';
import { useAI } from '@/context/AIContext';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LLMModel } from '@/services/aiService';

interface Message {
  sender: 'User' | 'Neema';
  text: string;
  timestamp?: Date;
}

const ChatWithNeema = () => {
  const { user } = useUser();
  const userId = user?.id || '';
  const { toast } = useToast();
  const { neemaContext, isContextLoading, refreshContext } = useAI();
  
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'Neema', text: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<LLMModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loadingModels, setLoadingModels] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');

  // Load available AI models
  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const modelList = await aiService.getAvailableModels();
        setModels(modelList);
        // Set default model from env or first available
        const defaultModel = import.meta.env.VITE_DEFAULT_MODEL || 
          (modelList.length > 0 ? `${modelList[0].providerId}/${modelList[0].id}` : '');
        setSelectedModel(defaultModel);
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setLoadingModels(false);
      }
    };
    
    fetchModels();
  }, []);

  // Set up speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';
      
      recognition.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };
      
      recognition.current.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(currentTranscript);
        setInput(currentTranscript);
      };
      
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        switch (event.error) {
          case 'network':
            setMessages(prev => [...prev, { 
              sender: 'Neema', 
              text: 'Network error occurred. Please check your internet connection and try again.' 
            }]);
            break;
          case 'not-allowed':
            setMessages(prev => [...prev, { 
              sender: 'Neema', 
              text: 'Microphone access was denied. Please allow microphone access to use voice input.' 
            }]);
            break;
          case 'no-speech':
            break;
          default:
            setMessages(prev => [...prev, { 
              sender: 'Neema', 
              text: 'An error occurred with voice input. Please try again or use text input instead.' 
            }]);
        }
        
        setIsListening(false);
        setTranscript('');
      };

      recognition.current.onend = () => {
        console.log('Speech recognition ended');
        
        if (transcript.trim() && isListening) {
          const finalTranscript = transcript.trim();
          setMessages(prev => [...prev, { 
            sender: 'User', 
            text: finalTranscript,
            timestamp: new Date()
          }]);
          handleAIResponse(finalTranscript);
          setInput('');
          setTranscript('');
        }
        
        setIsListening(false);
      };
    }
  }, [isListening, transcript]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!recognition.current) {
      setMessages(prev => [...prev, { 
        sender: 'Neema', 
        text: 'Speech recognition is not supported in your browser. Please use text input instead.' 
      }]);
      return;
    }
    
    try {
      if (isListening) {
        recognition.current.stop();
      } else {
        setTranscript('');
        recognition.current.start();
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      setIsListening(false);
      setMessages(prev => [...prev, { 
        sender: 'Neema', 
        text: 'An error occurred with voice input. Please try again or use text input instead.' 
      }]);
    }
  };

  const handleAIResponse = async (userMessage: string) => {
    if (!userId) {
      setMessages(prev => [...prev, { 
        sender: 'Neema', 
        text: 'You need to be logged in to use the AI assistant.' 
      }]);
      return;
    }
    
    setIsLoading(true);

    try {
      // Convert messages to the format expected by the AI service
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'User' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      // Generate response with context
      const response = await aiService.generateResponse(userMessage, chatHistory, neemaContext, selectedModel);
      
      // If message contains refresh/update requests, refresh AI context
      if (userMessage.toLowerCase().includes('refresh') || 
          userMessage.toLowerCase().includes('update') ||
          userMessage.toLowerCase().includes('latest')) {
        await refreshContext();
        
        toast({
          title: "Context updated",
          description: "Now working with the latest information"
        });
      }
      
      setMessages(prev => [...prev, { 
        sender: 'Neema', 
        text: response,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        sender: 'Neema', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { 
        sender: 'User', 
        text: userMessage,
        timestamp: new Date()
      }]);
      setInput('');
      handleAIResponse(userMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleRefreshContext = async () => {
    setIsLoading(true);
    
    try {
      await refreshContext();
      
      setMessages(prev => [...prev, { 
        sender: 'Neema', 
        text: 'I\'ve updated my understanding of your current tasks, emails, and calendar events.',
        timestamp: new Date()
      }]);
      
      toast({
        title: "Context refreshed",
        description: "AI assistant is now working with the latest information"
      });
    } catch (error) {
      console.error('Error refreshing context:', error);
      toast({
        title: "Failed to refresh context",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group models by provider
  const modelsByProvider = models.reduce((acc, model) => {
    const providerName = model.provider || model.providerId;
    if (!acc[providerName]) {
      acc[providerName] = [];
    }
    acc[providerName].push(model);
    return acc;
  }, {} as Record<string, LLMModel[]>);

  const handleSelectModel = (providerId: string, modelId: string) => {
    const fullModelId = `${providerId}/${modelId}`;
    setSelectedModel(fullModelId);
    
    toast({
      title: "Model changed",
      description: `Now using ${modelId} from ${providerId}`
    });
  };

  // Get display name for current model
  const getSelectedModelName = () => {
    if (!selectedModel) return 'Default AI Model';
    
    const [providerId, modelId] = selectedModel.split('/');
    const model = models.find(m => m.providerId === providerId && m.id === modelId);
    
    if (model) {
      return `${model.name} (${model.provider})`;
    }
    
    return selectedModel;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Chat with Neema</span>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={handleRefreshContext}
              disabled={isLoading || isContextLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || isContextLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Linkedin className="h-4 w-4" />
            </Button>
            
            {/* Model selector dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>AI Model</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs opacity-50" disabled>
                  {loadingModels ? 'Loading models...' : getSelectedModelName()}
                </DropdownMenuItem>
                
                {Object.entries(modelsByProvider).map(([provider, providerModels]) => (
                  <React.Fragment key={provider}>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">{provider}</DropdownMenuLabel>
                    {providerModels.map(model => (
                      <DropdownMenuItem 
                        key={model.id}
                        onClick={() => handleSelectModel(model.providerId, model.id)}
                      >
                        {model.name}
                      </DropdownMenuItem>
                    ))}
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
              <div className="text-xs font-medium text-muted-foreground mb-1">
                {msg.sender}
                {msg.timestamp && 
                  <span className="ml-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                }
              </div>
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
          {isListening && (
            <div className="mb-3 p-2 rounded-lg bg-pastel-sky/20 text-right">
              <div className="text-xs font-medium text-muted-foreground mb-1">Recording...</div>
              <div className="whitespace-pre-wrap">{transcript || "Listening..."}</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center mt-auto">
          <Button 
            type="button" 
            variant={isListening ? "default" : "ghost"}
            className={`h-10 w-10 p-0 mr-2 ${isListening ? "bg-red-500 text-white hover:bg-red-600" : ""}`}
            onClick={toggleListening}
            disabled={isLoading}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Type a message..."}
            className="flex-1 mr-2"
            disabled={isListening || isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading || isListening}
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