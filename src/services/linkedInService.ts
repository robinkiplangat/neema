import axios from 'axios';

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  profileImageUrl?: string;
}

export interface LinkedInConnection {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  profileImageUrl?: string;
  connectionDegree: number;
}

/**
 * Fetch user's LinkedIn profile
 */
export const fetchLinkedInProfile = async (): Promise<LinkedInProfile | null> => {
  try {
    const response = await axios.get('/api/linkedin/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    return null;
  }
};

/**
 * Fetch user's LinkedIn connections
 */
export const fetchLinkedInConnections = async (limit: number = 10): Promise<LinkedInConnection[]> => {
  try {
    const response = await axios.get(`/api/linkedin/connections?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching LinkedIn connections:', error);
    return [];
  }
};

/**
 * Search user's LinkedIn connections
 */
export const searchLinkedInConnections = async (query: string): Promise<LinkedInConnection[]> => {
  try {
    const response = await axios.get(`/api/linkedin/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching LinkedIn connections:', error);
    return [];
  }
}; 