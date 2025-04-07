
import TimeTracker from "../TimeTracker";

interface DashboardHeaderProps {
  isTracking: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
}

const DashboardHeader = ({ isTracking, onStartTimer, onStopTimer }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Good morning, Alex</h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your workspace today
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
