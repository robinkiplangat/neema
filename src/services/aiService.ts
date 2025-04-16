import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY;
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY;
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIContext {
  tasks?: any[];
  emails?: any[];
  events?: any[];
  userPreferences?: Record<string, any>;
  userProfile?: Record<string, any>;
  [key: string]: any;
}

// Configure axios with the API key
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'X-AI-API-Key': AI_API_KEY
  }
});

export const generateResponse = async (
  message: string,
  history: Message[] = [],
  context?: AIContext
): Promise<string> => {
  try {
    const response = await api.post(`/ai/chat`, {
      message,
      history,
      context,
      model: AI_MODEL
    });
    
    return response.data.response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};

export const generateTaskSuggestions = async (
  userId: string,
  context?: AIContext
): Promise<{ title: string; priority: string; dueDate?: string }[]> => {
  try {
    const response = await api.post(`/ai/suggest-tasks`, {
      userId,
      context,
      model: AI_MODEL
    });
    
    return response.data.suggestions;
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    return [];
  }
};

export const analyzeProductivity = async (
  userId: string,
  timeRange: { start: string; end: string },
  data: any[]
): Promise<any> => {
  try {
    const response = await api.post(`/ai/analyze-productivity`, {
      userId,
      timeRange,
      data,
      model: AI_MODEL
    });
    
    return response.data.analysis;
  } catch (error) {
    console.error('Error analyzing productivity:', error);
    return null;
  }
};

export const summarizeEmails = async (
  emails: any[],
  maxLength?: number
): Promise<string> => {
  try {
    const response = await api.post(`/ai/summarize-emails`, {
      emails,
      maxLength,
      model: AI_MODEL
    });
    
    return response.data.summary;
  } catch (error) {
    console.error('Error summarizing emails:', error);
    return 'Unable to generate email summary.';
  }
};

export const prioritizeTaskList = async (
  tasks: any[],
  context?: AIContext
): Promise<any[]> => {
  try {
    const response = await api.post(`/ai/prioritize-tasks`, {
      tasks,
      context,
      model: AI_MODEL
    });
    
    return response.data.prioritizedTasks;
  } catch (error) {
    console.error('Error prioritizing tasks:', error);
    return tasks; // Return original tasks on error
  }
};

export const generateDailySummary = async (
  userId: string,
  date?: string
): Promise<{
  greeting: string;
  focusAreas: string[];
  topTasks: any[];
  upcomingEvents: any[];
  insights: string;
}> => {
  try {
    const today = date || new Date().toISOString().split('T')[0];
    
    const response = await api.post(`/ai/daily-summary`, {
      userId,
      date: today,
      model: AI_MODEL
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating daily summary:', error);
    return {
      greeting: 'Good day',
      focusAreas: [],
      topTasks: [],
      upcomingEvents: [],
      insights: 'Unable to generate insights at this time.'
    };
  }
}; 