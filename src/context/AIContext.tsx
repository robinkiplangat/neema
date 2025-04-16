import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import * as taskService from '@/services/taskService';
import * as emailService from '@/services/emailService';
import * as calendarService from '@/services/calendarService';
import * as productivityService from '@/services/productivityService';

interface AIContextType {
  neemaContext: {
    recentTasks: taskService.Task[];
    upcomingEvents: calendarService.CalendarEvent[];
    unreadEmails: emailService.Email[];
    productivityStats: productivityService.ProductivityStat[];
    timeDistribution: productivityService.TimeDistribution[];
    userPreferences: Record<string, any>;
  };
  isContextLoading: boolean;
  refreshContext: () => Promise<void>;
  lastRefreshed: Date | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id || '';
  const [isContextLoading, setIsContextLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [neemaContext, setNeemaContext] = useState({
    recentTasks: [],
    upcomingEvents: [],
    unreadEmails: [],
    productivityStats: [],
    timeDistribution: [],
    userPreferences: {}
  });
  
  const loadContext = async () => {
    if (!userId || !isUserLoaded) {
      setIsContextLoading(false);
      return;
    }
    
    setIsContextLoading(true);
    
    try {
      const [tasks, events, emails, productivityStats, timeDistribution] = await Promise.all([
        taskService.fetchTasks(userId),
        calendarService.fetchTodayEvents(userId),
        emailService.fetchUnreadEmails(userId),
        productivityService.fetchProductivityStats(userId),
        productivityService.fetchTimeDistribution(userId),
      ]);
      
      // Load user preferences (for now use mock data, would be replaced with actual preferences service)
      const userPreferences = {
        workHours: { start: 9, end: 17 },
        focusTime: true,
        productiveTimeBlocks: ['morning'],
        theme: 'light',
        emailNotifications: true,
        taskReminderMinutes: 15
      };
      
      setNeemaContext({
        recentTasks: tasks,
        upcomingEvents: events,
        unreadEmails: emails,
        productivityStats,
        timeDistribution,
        userPreferences
      });
      
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error loading AI context:', error);
    } finally {
      setIsContextLoading(false);
    }
  };
  
  useEffect(() => {
    if (isUserLoaded && userId) {
      loadContext();
    }
  }, [isUserLoaded, userId]);
  
  const refreshContext = async () => {
    await loadContext();
  };
  
  return (
    <AIContext.Provider value={{ 
      neemaContext, 
      isContextLoading,
      refreshContext,
      lastRefreshed
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}; 