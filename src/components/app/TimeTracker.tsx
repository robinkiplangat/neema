
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeTrackerProps {
  isTracking: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
}

const TimeTracker = ({ isTracking, onStartTimer, onStopTimer }: TimeTrackerProps) => {
  const [project, setProject] = useState("design-system");
  const [task, setTask] = useState("updates");
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      let seconds = 0;
      interval = setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        setElapsedTime(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        );
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTracking]);

  return (
    <div className="w-full md:w-auto bg-white rounded-xl border shadow-sm p-3 flex flex-col sm:flex-row items-center gap-3 hover:shadow-md transition-all duration-300">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        <Select value={project} onValueChange={setProject}>
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website-redesign">Website Redesign</SelectItem>
            <SelectItem value="mobile-app">Mobile App</SelectItem>
            <SelectItem value="design-system">Design System</SelectItem>
            <SelectItem value="marketing">Marketing Campaign</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={task} onValueChange={setTask}>
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="Select task" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="updates">Updates</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {isTracking ? (
          <>
            <div className="flex items-center gap-2 bg-pastel-pink/10 text-pastel-blush font-mono font-medium px-3 py-1.5 rounded-md">
              <Clock className="h-4 w-4" />
              <span>{elapsedTime}</span>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 rounded-lg"
              onClick={onStopTimer}
            >
              <Square className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button 
            className="w-full sm:w-auto magnetic-button rounded-lg"
            onClick={onStartTimer}
          >
            <Play className="mr-2 h-4 w-4" />
            Start Timer
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;
