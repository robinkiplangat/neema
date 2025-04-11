import TimeTracker from "../TimeTracker";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useRandomQuote } from "@/services/quoteService";
import { Quote } from "lucide-react";

interface DashboardHeaderProps {
  isTracking: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
}

const DashboardHeader = ({ isTracking, onStartTimer, onStopTimer }: DashboardHeaderProps) => {
  const { user } = useUser();
  const firstName = user?.firstName || "User";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const quote = useRandomQuote(); // This will update hourly
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{getGreeting()}, {firstName}</h1>
          <p className="text-muted-foreground mt-1">
            {email} • Here's an overview of your workspace today
          </p>
        </div>
        
        <TimeTracker 
          isTracking={isTracking}
          onStartTimer={onStartTimer}
          onStopTimer={onStopTimer}
        />
      </div>
      
      {/* Quote Section */}
      <div className="bg-pastel-sky/20 rounded-lg p-4 border border-pastel-sky/30 flex items-start gap-3">
        <div className="bg-pastel-sky/30 rounded-full p-2 mt-0.5">
          <Quote className="h-4 w-4 text-neema-primary" />
        </div>
        <div>
          <p className="font-medium text-neema-primary">{quote.quote}</p>
          <p className="text-sm text-muted-foreground mt-1">→ {quote.explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
