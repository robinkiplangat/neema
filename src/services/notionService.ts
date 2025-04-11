import axios from 'axios';

export interface NotionNote {
  id: string;
  title: string;
  content: string;
  lastEdited: string;
}

/**
 * Fetch notes from Notion
 */
export const fetchNotionNotes = async (): Promise<NotionNote[]> => {
  try {
    // In a real implementation, this would make an API call to your backend
    // which would then use the Notion API with proper authentication
    const response = await axios.get('/api/notion/notes');
    return response.data;
  } catch (error) {
    console.error('Error fetching Notion notes:', error);
    return [];
  }
};

/**
 * Search Notion notes
 */
export const searchNotionNotes = async (query: string): Promise<NotionNote[]> => {
  try {
    const response = await axios.get(`/api/notion/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching Notion notes:', error);
    return [];
  }
};

/**
 * Create a new note in Notion
 */
export const createNotionNote = async (title: string, content: string): Promise<NotionNote | null> => {
  try {
    const response = await axios.post('/api/notion/notes', { title, content });
    return response.data;
  } catch (error) {
    console.error('Error creating Notion note:', error);
    return null;
  }
}; 