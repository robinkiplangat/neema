import { useClerkApi } from './clerkApi';
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

// Optionally, you can add X-Email-API-Key to each request if your backend requires it.
// Otherwise, rely on the api instance for Clerk JWT auth.

// Export a hook that provides all email API methods using Clerk
import { useCallback } from 'react';

export function useEmailApi() {
  const api = useClerkApi();

  const fetchEmails = useCallback(async (userId: string, limit: number = 20): Promise<Email[]> => {
    try {
      const response = await api.get(`/emails`, { params: { userId, limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching emails:', error);
      return [];
    }
  }, [api]);

  const fetchUnreadEmails = useCallback(async (userId: string): Promise<Email[]> => {
    try {
      const response = await api.get(`/emails/unread`, { params: { userId } });
      return response.data;
    } catch (error) {
      console.error('Error fetching unread emails:', error);
      return [];
    }
  }, [api]);

  const fetchEmailById = useCallback(async (emailId: string): Promise<Email | null> => {
    try {
      const response = await api.get(`/emails/${emailId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching email by id:', error);
      return null;
    }
  }, [api]);

  const markEmailAsRead = useCallback(async (emailId: string): Promise<boolean> => {
    try {
      await api.put(`/emails/${emailId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking email as read:', error);
      return false;
    }
  }, [api]);

  const toggleEmailStar = useCallback(async (emailId: string): Promise<boolean> => {
    try {
      await api.put(`/emails/${emailId}/star`);
      return true;
    } catch (error) {
      console.error('Error toggling email star:', error);
      return false;
    }
  }, [api]);

  const sendEmail = useCallback(async (
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
}, [api]);

  const addTagToEmail = useCallback(async (emailId: string, tag: string): Promise<boolean> => {
    try {
      await api.put(`/emails/${emailId}/tag`, { tag });
      return true;
    } catch (error) {
      console.error('Error adding tag to email:', error);
      return false;
    }
  }, [api]);

  const removeTagFromEmail = useCallback(async (emailId: string, tag: string): Promise<boolean> => {
    try {
      await api.delete(`/emails/${emailId}/tag/${encodeURIComponent(tag)}`);
      return true;
    } catch (error) {
      console.error('Error removing tag from email:', error);
      return false;
    }
  }, [api]);

  return {
    fetchEmails,
    fetchUnreadEmails,
    fetchEmailById,
    markEmailAsRead,
    toggleEmailStar,
    sendEmail,
    addTagToEmail,
    removeTagFromEmail,
  };
};