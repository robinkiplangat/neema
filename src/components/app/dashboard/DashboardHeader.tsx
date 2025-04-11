import TimeTracker from "../TimeTracker";
import { useUser } from "@clerk/clerk-react";

interface DashboardHeaderProps {
  isTracking: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
}

const DashboardHeader = ({ isTracking, onStartTimer, onStopTimer }: DashboardHeaderProps) => {
  const { user } = useUser();
  const firstName = user?.firstName || "User";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  return (
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
  );
};

export default DashboardHeader;
