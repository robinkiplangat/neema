import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Environment variables
const OPENROUTER_ENDPOINT = import.meta.env.VITE_OPENROUTER_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || 'meta-llama/llama-4-maverick:free';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const sendMessageToAI = async (messages: ChatMessage[]): Promise<string> => {
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key is not configured');
    throw new Error('AI service is not properly configured. Please check your environment variables.');
  }

  try {
    const response = await axios.post(
      OPENROUTER_ENDPOINT,
      {
        model: DEFAULT_MODEL,
        messages: messages,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      console.error('Unexpected response format from AI service:', response.data);
      throw new Error('Received invalid response format from AI service');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('AI Service Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        throw new Error('Invalid API key for AI service');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded for AI service');
      }
    }
    
    console.error('Error sending message to AI:', error);
    throw new Error('Failed to get response from AI service. Please try again later.');
  }
};

export const generateResponse = async (userMessage: string, chatHistory: ChatMessage[] = []): Promise<string> => {
  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are Neema, an AI assistant. You help users with their work, scheduling, and productivity. You can also access information from Google Calendar, Notion, and LinkedIn when requested. Be concise, helpful, and friendly.' },
    ...chatHistory,
    { role: 'user', content: userMessage }
  ];

  return sendMessageToAI(messages);
}; 