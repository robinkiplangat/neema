
import { useState } from "react";
import AppLayout from "@/components/app/AppLayout";
import OverviewStats from "@/components/app/OverviewStats";
import RecentActivity from "@/components/app/RecentActivity";
import TimeTracker from "@/components/app/TimeTracker";
import ProjectOverview from "@/components/app/ProjectOverview";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/shared/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Good morning, Alex</h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your workspace today
            </p>
          </div>
          
          <TimeTracker 
            isTracking={isTracking}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
          />
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-work">My Work</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <OverviewStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProjectOverview />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="my-work">
            <div className="h-96 flex items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">My Work content goes here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="productivity">
            <div className="h-96 flex items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">Productivity content goes here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
