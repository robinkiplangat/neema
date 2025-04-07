
import { useState } from "react";
import AppLayout from "@/components/app/AppLayout";
import OverviewStats from "@/components/app/OverviewStats";
import RecentActivity from "@/components/app/RecentActivity";
import TimeTracker from "@/components/app/TimeTracker";
import ProjectOverview from "@/components/app/ProjectOverview";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/shared/PageTitle";
import { ShapesBlob, ShapesDecoration } from "@/components/ui/shapes";

const Dashboard = () => {
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();
  
  const handleStartTimer = () => {
    setIsTracking(true);
    toast({
      title: "Timer started",
      description: "Tracking time for Design System Updates",
    });
  };
  
  const handleStopTimer = () => {
    setIsTracking(false);
    toast({
      title: "Timer stopped",
      description: "Tracked 00:05:23 for Design System Updates",
    });
  };

  return (
    <AppLayout>
      <PageTitle title="Dashboard | Magnetic" />
      
      <div className="relative overflow-hidden">
        <ShapesDecoration />
        
        <div className="space-y-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pastel-blush to-pastel-pink">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's an overview of your workspace.
              </p>
            </div>
            
            <TimeTracker 
              isTracking={isTracking}
              onStartTimer={handleStartTimer}
              onStopTimer={handleStopTimer}
            />
          </div>
          
          <OverviewStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProjectOverview />
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
