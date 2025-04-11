import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToAI = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await axios.post(
      process.env.OPENROUTER_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.DEFAULT_MODEL || 'meta-llama/llama-4-maverick:free',
        messages: messages,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw new Error('Failed to get response from AI service');
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