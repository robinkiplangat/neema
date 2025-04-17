"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { api } from '@/lib/api';

// Define the integration status type
export type IntegrationStatus = {
  isConnected: boolean;
  lastSync?: Date;
  syncStatus?: 'success' | 'error' | 'syncing';
  error?: string;
};

// Define the integration context type
export type IntegrationContextType = {
  // Integration statuses
  notionStatus: IntegrationStatus;
  googleStatus: IntegrationStatus;
  linkedInStatus: IntegrationStatus;
  isLoading: boolean;
  
  // Connection functions
  connectNotion: () => Promise<void>;
  connectGoogle: () => Promise<void>;
  connectLinkedIn: () => Promise<void>;
  
  // Disconnect functions
  disconnectNotion: () => Promise<boolean>;
  disconnectGoogle: () => Promise<boolean>;
  disconnectLinkedIn: () => Promise<boolean>;
  
  // OAuth callback completion functions
  completeNotionConnection: (code: string) => Promise<boolean>;
  completeGoogleConnection: (code: string, state?: string | null) => Promise<boolean>;
  completeLinkedInConnection: (code: string, state?: string | null) => Promise<boolean>;
  
  // Refresh status
  refreshStatus: () => Promise<void>;
};

// Create the context with default values
const IntegrationContext = createContext<IntegrationContextType>({
  notionStatus: { isConnected: false },
  googleStatus: { isConnected: false },
  linkedInStatus: { isConnected: false },
  isLoading: true,
  
  connectNotion: async () => {},
  connectGoogle: async () => {},
  connectLinkedIn: async () => {},
  
  disconnectNotion: async () => false,
  disconnectGoogle: async () => false,
  disconnectLinkedIn: async () => false,
  
  completeNotionConnection: async () => false,
  completeGoogleConnection: async () => false,
  completeLinkedInConnection: async () => false,
  
  refreshStatus: async () => {},
});

// Create the provider component
export function IntegrationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user, isLoading: userLoading } = useUser();
  
  // Integration status states
  const [notionStatus, setNotionStatus] = useState<IntegrationStatus>({ isConnected: false });
  const [googleStatus, setGoogleStatus] = useState<IntegrationStatus>({ isConnected: false });
  const [linkedInStatus, setLinkedInStatus] = useState<IntegrationStatus>({ isConnected: false });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to fetch integration statuses
  const fetchIntegrationStatuses = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await api.get('/api/integrations/status');
      
      if (response.data) {
        setNotionStatus(response.data.notion || { isConnected: false });
        setGoogleStatus(response.data.google || { isConnected: false });
        setLinkedInStatus(response.data.linkedin || { isConnected: false });
      }
    } catch (error) {
      console.error('Error fetching integration statuses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch integration statuses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch integration statuses on mount and when user changes
  useEffect(() => {
    if (!userLoading && user) {
      fetchIntegrationStatuses();
    }
  }, [user, userLoading]);

  // Connect to Notion
  const connectNotion = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to connect to Notion',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await api.get('/api/integrations/notion/auth-url');
      
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error initiating Notion connection:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to initiate Notion connection',
        variant: 'destructive',
      });
    }
  };

  // Connect to Google
  const connectGoogle = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to connect to Google',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await api.get('/api/integrations/google/auth-url');
      
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error initiating Google connection:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to initiate Google connection',
        variant: 'destructive',
      });
    }
  };

  // Connect to LinkedIn
  const connectLinkedIn = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to connect to LinkedIn',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await api.get('/api/integrations/linkedin/auth-url');
      
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error initiating LinkedIn connection:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to initiate LinkedIn connection',
        variant: 'destructive',
      });
    }
  };

  // Disconnect from Notion
  const disconnectNotion = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to disconnect from Notion',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      await api.post('/api/integrations/notion/disconnect');
      
      // Update local state
      setNotionStatus({ isConnected: false });
      
      toast({
        title: 'Disconnected',
        description: 'Successfully disconnected from Notion',
      });
      
      return true;
    } catch (error) {
      console.error('Error disconnecting from Notion:', error);
      toast({
        title: 'Disconnect Error',
        description: 'Failed to disconnect from Notion',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Disconnect from Google
  const disconnectGoogle = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to disconnect from Google',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      await api.post('/api/integrations/google/disconnect');
      
      // Update local state
      setGoogleStatus({ isConnected: false });
      
      toast({
        title: 'Disconnected',
        description: 'Successfully disconnected from Google',
      });
      
      return true;
    } catch (error) {
      console.error('Error disconnecting from Google:', error);
      toast({
        title: 'Disconnect Error',
        description: 'Failed to disconnect from Google',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Disconnect from LinkedIn
  const disconnectLinkedIn = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to disconnect from LinkedIn',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      await api.post('/api/integrations/linkedin/disconnect');
      
      // Update local state
      setLinkedInStatus({ isConnected: false });
      
      toast({
        title: 'Disconnected',
        description: 'Successfully disconnected from LinkedIn',
      });
      
      return true;
    } catch (error) {
      console.error('Error disconnecting from LinkedIn:', error);
      toast({
        title: 'Disconnect Error',
        description: 'Failed to disconnect from LinkedIn',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Complete Notion OAuth connection
  const completeNotionConnection = async (code: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to connect to Notion',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      await api.post('/api/integrations/notion/callback', { code });
      
      // Update local state
      setNotionStatus({
        isConnected: true,
        lastSync: new Date(),
        syncStatus: 'success',
      });
      
      return true;
    } catch (error) {
      console.error('Error completing Notion connection:', error);
      return false;
    }
  };

  // Complete Google OAuth connection
  const completeGoogleConnection = async (code: string, state?: string | null): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to connect to Google',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      await api.post('/api/integrations/google/callback', { code, state });
      
      // Update local state
      setGoogleStatus({
        isConnected: true,
        lastSync: new Date(),
        syncStatus: 'success',
      });
      
      return true;
    } catch (error) {
      console.error('Error completing Google connection:', error);
      return false;
    }
  };

  // Complete LinkedIn OAuth connection
  const completeLinkedInConnection = async (code: string, state?: string | null): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to connect to LinkedIn',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      await api.post('/api/integrations/linkedin/callback', { code, state });
      
      // Update local state
      setLinkedInStatus({
        isConnected: true,
        lastSync: new Date(),
        syncStatus: 'success',
      });
      
      return true;
    } catch (error) {
      console.error('Error completing LinkedIn connection:', error);
      return false;
    }
  };

  // Refresh integration statuses
  const refreshStatus = async () => {
    await fetchIntegrationStatuses();
  };

  // Provide the context value
  const contextValue: IntegrationContextType = {
    notionStatus,
    googleStatus,
    linkedInStatus,
    isLoading,
    
    connectNotion,
    connectGoogle,
    connectLinkedIn,
    
    disconnectNotion,
    disconnectGoogle,
    disconnectLinkedIn,
    
    completeNotionConnection,
    completeGoogleConnection,
    completeLinkedInConnection,
    
    refreshStatus,
  };

  return (
    <IntegrationContext.Provider value={contextValue}>
      {children}
    </IntegrationContext.Provider>
  );
}

// Create a hook to use the integration context
export const useIntegrations = () => useContext(IntegrationContext); 