
import { useState } from "react";
import AppLayout from "@/components/app/AppLayout";
import PageTitle from "@/components/shared/PageTitle";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/app/dashboard/DashboardHeader";
import DashboardTabs from "@/components/app/dashboard/DashboardTabs";

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
      
      <div className="space-y-6">
        <DashboardHeader 
          isTracking={isTracking}
          onStartTimer={handleStartTimer}
          onStopTimer={handleStopTimer}
        />
        
        <DashboardTabs />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
