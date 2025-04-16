import { useState } from "react";
import AppLayout from "@/components/app/AppLayout";
import PageTitle from "@/components/shared/PageTitle";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/app/dashboard/DashboardHeader";
import DashboardTabs from "@/components/app/dashboard/DashboardTabs";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firstName = user?.firstName || "User";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  const handleStartTimer = () => {
    setIsTracking(true);
    toast({
      title: "Timer started",
      description: "Tracking time for current task",
    });
  };
  
  const handleStopTimer = () => {
    setIsTracking(false);
    toast({
      title: "Timer stopped",
      description: "Time tracked successfully",
    });
  };

  return (
    <>
      <SignedIn>
        <AppLayout>
          <PageTitle title="Dashboard | Neema" />
          
          <div className="space-y-6">
            <div className="bg-white/80 p-4 rounded-xl border border-neema-secondary/20 mb-6 flex items-start gap-4 shadow-sm">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{getGreeting()}, {firstName}</h3>
                <p className="text-muted-foreground text-sm">Focus on your top priorities today. I've organized your schedule and tasks.</p>
              </div>
            </div>
            
            <DashboardHeader 
              isTracking={isTracking}
              onStartTimer={handleStartTimer}
              onStopTimer={handleStopTimer}
            />
            
            <DashboardTabs />
          </div>
        </AppLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Dashboard;
