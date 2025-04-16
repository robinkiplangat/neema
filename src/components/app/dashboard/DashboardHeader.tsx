import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, PlusCircle, Clock, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  isTracking: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
}

const DashboardHeader = ({
  isTracking,
  onStartTimer,
  onStopTimer,
}: DashboardHeaderProps) => {
  return (
    <Card className="bg-white border shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-medium mb-1">Current Focus</h2>
            <p className="text-muted-foreground text-sm">What are you working on?</p>
          </div>
          
          <div className="flex items-center gap-2">
            {isTracking ? (
              <>
                <div className="text-lg font-mono mr-2">00:05:23</div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onStopTimer}
                  className="gap-1"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={onStartTimer}
                className="gap-1"
              >
                <Play className="h-4 w-4" />
                Start Timer
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Task
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="h-4 w-4 mr-2" />
                  View Time Logs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
