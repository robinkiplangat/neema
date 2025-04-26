import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

// Define integration status interface
interface IntegrationStatus {
  isConnected: boolean;
  workspace?: string; // Notion workspace name, etc.
  // Add other status details here
}

// Define integration context type
interface IntegrationContextType {
  notionStatus: IntegrationStatus;
  googleStatus: IntegrationStatus;
  linkedInStatus: IntegrationStatus;
  isLoading: boolean;
  
  connectNotion: () => Promise<void>;
  connectGoogle: () => Promise<void>;
  connectLinkedIn: () => Promise<void>;
  
  disconnectNotion: () => Promise<boolean>;
  disconnectGoogle: () => Promise<boolean>;
  disconnectLinkedIn: () => Promise<boolean>;
  
  completeNotionConnection: (code: string) => Promise<boolean>;
  completeGoogleConnection: (code: string) => Promise<boolean>;
  completeLinkedInConnection: (code: string) => Promise<boolean>;
  
  refreshStatus: () => Promise<void>;
}

 // Define the API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

 // Utility function to make API requests
const apiRequest = async (
  url: string,
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  data?: any
) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const response = await axios({
      url: `${API_BASE_URL}${url}`,
      method,
      data,
      withCredentials: true,
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.error(`API request failed: ${method} ${url}`, error.response?.data || error.message);
    throw error;
  }
};

 // Create the context with default values
const IntegrationContext = createContext<IntegrationContextType>({
  notionStatus: { isConnected: false },
  googleStatus: { isConnected: false },
  linkedInStatus: { isConnected: false },
  isLoading: false,
  
  connectNotion: async () => { },
  connectGoogle: async () => { },
  connectLinkedIn: async () => { },
  
  disconnectNotion: async () => false,
  disconnectGoogle: async () => false,
  disconnectLinkedIn: async () => false,
  
  completeNotionConnection: async () => false,
  completeGoogleConnection: async () => false,
  completeLinkedInConnection: async () => false,
  
  refreshStatus: async () => { },
});

 // Create the provider component
export function IntegrationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user, isLoading: userLoading, isLoaded } = useUser();
  
  // Integration status states
  const [notionStatus, setNotionStatus] = useState<IntegrationStatus>({ isConnected: false });
  const [googleStatus, setGoogleStatus] = useState<IntegrationStatus>({ isConnected: false });
  const [linkedInStatus, setLinkedInStatus] = useState<IntegrationStatus>({ isConnected: false });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  

  // refreshStatus - Get initial Statuses of all integrations
  const refreshStatus = useCallback(async () => {
      if (!user || !isLoaded) return; // Prevent calls before user is available

      setIsLoading(true);

      try {
          // Notion Status
          const notionStatus = await apiRequest('/integrations/notion/status');
          setNotionStatus(notionStatus);
      } catch (error) {
          console.error('Error fetching Notion status:', error);
          toast({ title: 'Error fetching Notion status', description: 'Please try again.', variant: 'destructive' });
      }

      try {
          // Google Status
          const googleStatus = await apiRequest('/api/calendar/status');
          setGoogleStatus(googleStatus);
      } catch (error) {
          console.error('Error fetching Google status:', error);
          toast({ title: 'Error fetching Google status', description: 'Please try again.', variant: 'destructive' });
      }

      try {
          // LinkedIn Status
          const linkedInStatus = await apiRequest('/integrations/linkedin/status');
          setLinkedInStatus(linkedInStatus);
      } catch (error) {
          console.error('Error fetching LinkedIn status:', error);
          toast({ title: 'Error fetching LinkedIn status', description: 'Please try again.', variant: 'destructive' });
      }

      setIsLoading(false);
  }, [user, isLoaded, toast]);


  // useEffect to refresh status on user load
  useEffect(() => {
    if (!userLoading && isLoaded) refreshStatus();
  }, [userLoading, isLoaded, refreshStatus]);

  // Function to initiate Notion connection
  const connectNotion = useCallback(async () => {
    if (!user) {
      toast({ title: 'No User', description: 'Please try to Login.', variant: 'destructive' });
      return;
    }

    try {
      // get the auth url
      const response = await apiRequest(
        `/integrations/notion/connect`,
        'post',
        { redirectUrl: `${window.location.origin}/dashboard/integrations` }
      );

      // Redirect user to the Notion authorization URL
      window.location.href = response.authUrl;
    } catch (error) {
      console.error('Error connecting to Notion:', error);
      toast({ title: 'Error connecting to Notion', description: 'Please try again.', variant: 'destructive' });
    }
  }, [user, toast]);
  
  // Function to complete Notion connection after OAuth redirect
  const completeNotionConnection = useCallback(async (code: string) => {
      if (!user) return false;
      try {
          const success = await apiRequest(
            `/integrations/notion/callback`,
            'post',
            { userId: user.id, code }
          );

          if (success) {
              toast({ title: 'Notion connected!', description: 'Integration successful.' });
              await refreshStatus();
              return true;
          } else {
              toast({ title: 'Notion connection failed', description: 'Please try again.', variant: 'destructive' });
              return false;
          }

      } catch (error) {
          console.error('Error completing Notion connection:', error);
          toast({ title: 'Error completing Notion connection', description: 'Please try again.', variant: 'destructive' });
          return false;
      }
  }, [user, toast, refreshStatus]);

  // Function to disconnect Notion
  const disconnectNotion = useCallback(async () => {
    if (!user) return false;
    try {
      await apiRequest(
        `/integrations/notion/disconnect`,
        'post',
        { userId: user.id }
      );
      toast({ title: 'Notion disconnected', description: 'Integration removed.' });
      await refreshStatus();
      return true;
    } catch (error) {
      console.error('Error disconnecting Notion:', error);
      toast({ title: 'Error disconnecting Notion', description: 'Please try again.', variant: 'destructive' });
      return false;
    }
  }, [user, toast, refreshStatus]);
  

  // Function to initiate Google connection
  const connectGoogle = useCallback(async () => {
    try {
      // Redirect user to the Google authorization URL
      window.location.href = `${API_BASE_URL}/api/calendar/auth/google`;
    } catch (error) {
      console.error('Error connecting to Google:', error);
      toast({ title: 'Error connecting to Google', description: 'Please try again.', variant: 'destructive' });
    }
  }, [toast]);
  
  // Function to complete Google connection after OAuth redirect
  const completeGoogleConnection = useCallback(async (code: string) => {
    if (!user) return false;
    try {
      // For now, this function does nothing, because the backend handles
      // the Google OAuth callback and redirects back to /dashboard/integrations
      // with a success or error query parameter.
      // We can use useEffect on the /dashboard/integrations page to read
      // the query parameter and show a success/error toast.
      toast({ title: 'Google connected!', description: 'Integration successful.' });
      await refreshStatus();
      return true; // Placeholder return value
    } catch (error) {
      console.error('Error completing Google connection:', error);
      toast({ title: 'Error completing Google connection', description: 'Please try again.', variant: 'destructive' });
      return false;
    }
  }, [user, toast, refreshStatus]);

  // Function to disconnect Google
  const disconnectGoogle = useCallback(async () => {
    try {
      await apiRequest(
        `/api/calendar/disconnect`,
        'post',
        { userId: user?.id }
      );
      toast({ title: 'Google disconnected', description: 'Integration removed.' });
      await refreshStatus();
      return true;
    } catch (error) {
      console.error('Error disconnecting Google:', error);
      toast({ title: 'Error disconnecting Google', description: 'Please try again.', variant: 'destructive' });
      return false;
    }
  }, [user, toast, refreshStatus]);
  
  
  // Function to initiate LinkedIn connection
  const connectLinkedIn = useCallback(async () => {
    if (!user) {
      toast({ title: 'No User', description: 'Please try to Login.', variant: 'destructive' });
      return;
    }

    try {
      // get the auth url
      const response = await apiRequest(
        `/integrations/linkedin/connect`,
        'post',
        { redirectUrl: `${window.location.origin}/dashboard/integrations` }
      );

      // Redirect user to the LinkedIn authorization URL
      window.location.href = response.authUrl;
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
      toast({ title: 'Error connecting to LinkedIn', description: 'Please try again.', variant: 'destructive' });
    }
  }, [user, toast]);

  // Function to complete LinkedIn connection after OAuth redirect
  const completeLinkedInConnection = useCallback(async (code: string) => {
    if (!user) return false;
    try {
      const success = await apiRequest(
        `/integrations/linkedin/callback`,
        'post',
        { userId: user.id, code }
      );

      if (success) {
        toast({ title: 'LinkedIn connected!', description: 'Integration successful.' });
        await refreshStatus();
        return true;
      } else {
        toast({ title: 'LinkedIn connection failed', description: 'Please try again.', variant: 'destructive' });
        return false;
      }
    } catch (error) {
      console.error('Error completing LinkedIn connection:', error);
      toast({ title: 'Error completing LinkedIn connection', description: 'Please try again.', variant: 'destructive' });
      return false;
    }
  }, [user, toast, refreshStatus]);

  // Function to disconnect LinkedIn
  const disconnectLinkedIn = useCallback(async () => {
    if (!user) return false;
    try {
      await apiRequest(
        `/integrations/linkedin/disconnect`,
        'post',
        { userId: user.id }
      );
      toast({ title: 'LinkedIn disconnected', description: 'Integration removed.' });
      await refreshStatus();
      return true;
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      toast({ title: 'Error disconnecting LinkedIn', description: 'Please try again.', variant: 'destructive' });
      return false;
    }
  }, [user, toast, refreshStatus]);

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
