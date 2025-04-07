
import { useState } from "react";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  ArrowUp,
  ArrowDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const OverviewStats = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    hoursTracked: 32.5,
    tasksCompleted: 24,
    billableHours: 27.5,
    upcomingDeadlines: 5
  });

  // Simulate refreshing stats
  const refreshStats = () => {
    // Simulate slight changes to stats
    setStats({
      hoursTracked: +(stats.hoursTracked + (Math.random() * 2 - 1)).toFixed(1),
      tasksCompleted: Math.max(0, stats.tasksCompleted + Math.floor(Math.random() * 3) - 1),
      billableHours: +(stats.billableHours + (Math.random() * 1.5 - 0.5)).toFixed(1),
      upcomingDeadlines: Math.max(0, stats.upcomingDeadlines + Math.floor(Math.random() * 3) - 1)
    });
    
    toast({
      title: "Stats refreshed",
      description: "Dashboard statistics have been updated."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshStats}
          className="text-xs"
        >
          Refresh Stats
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-none shadow-sm rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hours tracked this week</p>
                <h3 className="text-2xl font-bold mt-1">{stats.hoursTracked}h</h3>
                <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +4.5h from last week
                </p>
              </div>
              <div className="bg-blue-50 rounded-full p-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks completed</p>
                <h3 className="text-2xl font-bold mt-1">{stats.tasksCompleted}</h3>
                <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {Math.round((stats.tasksCompleted / 31) * 100)}% completion rate
                </p>
              </div>
              <div className="bg-green-50 rounded-full p-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Billable hours</p>
                <h3 className="text-2xl font-bold mt-1">{stats.billableHours}h</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((stats.billableHours / stats.hoursTracked) * 100)}% billable rate
                </p>
              </div>
              <div className="bg-purple-50 rounded-full p-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming deadlines</p>
                <h3 className="text-2xl font-bold mt-1">{stats.upcomingDeadlines}</h3>
                <p className="text-sm text-amber-600 font-medium mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  2 due this week
                </p>
              </div>
              <div className="bg-amber-50 rounded-full p-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewStats;
