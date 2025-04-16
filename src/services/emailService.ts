import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY;
const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY;

export interface EmailSender {
  name: string;
  email: string;
  avatar?: string;
}

export interface Email {
  id: string;
  sender: EmailSender;
  subject: string;
  preview: string;
  body?: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  tags?: string[];
  userId: string;
}

// Configure axios with the API key
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'X-Email-API-Key': EMAIL_API_KEY
  }
});

export const fetchEmails = async (userId: string, limit: number = 20): Promise<Email[]> => {
  try {
    const response = await api.get(`/emails`, {
      params: { userId, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
};

export const fetchUnreadEmails = async (userId: string): Promise<Email[]> => {
  try {
    const response = await api.get(`/emails/unread`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching unread emails:', error);
    return [];
  }
};

export const fetchEmailById = async (emailId: string): Promise<Email | null> => {
  try {
    const response = await api.get(`/emails/${emailId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching email by id:', error);
    return null;
  }
};

export const markEmailAsRead = async (emailId: string): Promise<boolean> => {
  try {
    await api.put(`/emails/${emailId}/read`);
    return true;
  } catch (error) {
    console.error('Error marking email as read:', error);
    return false;
  }
};

export const toggleEmailStar = async (emailId: string): Promise<boolean> => {
  try {
    await api.put(`/emails/${emailId}/star`);
    return true;
  } catch (error) {
    console.error('Error toggling email star:', error);
    return false;
  }
};

export const sendEmail = async (
  userId: string,
  to: string[],
  subject: string,
  body: string,
  cc?: string[],
  bcc?: string[]
): Promise<boolean> => {
  try {
    await api.post(`/emails/send`, {
      userId,
      to,
      subject,
      body,
      cc,
      bcc
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const addTagToEmail = async (
  emailId: string,
  tag: string
): Promise<boolean> => {
  try {
    await api.put(`/emails/${emailId}/tag`, { tag });
    return true;
  } catch (error) {
    console.error('Error adding tag to email:', error);
    return false;
  }
};

export const removeTagFromEmail = async (
  emailId: string,
  tag: string
): Promise<boolean> => {
  try {
    await api.delete(`/emails/${emailId}/tag/${encodeURIComponent(tag)}`);
    return true;
  } catch (error) {
    console.error('Error removing tag from email:', error);
    return false;
  }
}; 