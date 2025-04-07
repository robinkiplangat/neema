import { useState } from "react";
import AppLayout from "@/components/app/AppLayout";
import OverviewStats from "@/components/app/OverviewStats";
import RecentActivity from "@/components/app/RecentActivity";
import TimeTracker from "@/components/app/TimeTracker";
import ProjectOverview from "@/components/app/ProjectOverview";
import ProductivityChart from "@/components/app/ProductivityChart";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/shared/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, BarChart3, TrendingUp, Gauge } from "lucide-react";

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

  const productivityStats = [
    { 
      title: "Weekly Billable", 
      value: 27.3, 
      target: 35, 
      unit: "hours",
      progress: 78,
      change: "+12%",
      trend: "up" 
    },
    { 
      title: "Utilization Rate", 
      value: 82, 
      target: 85, 
      unit: "%",
      progress: 96,
      change: "+5%",
      trend: "up" 
    },
    { 
      title: "On-time Delivery", 
      value: 92, 
      target: 95, 
      unit: "%",
      progress: 97,
      change: "-2%",
      trend: "down" 
    },
    { 
      title: "Client Satisfaction", 
      value: 4.8, 
      target: 5.0, 
      unit: "/5",
      progress: 96,
      change: "+0.2",
      trend: "up" 
    }
  ];

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
            <div className="space-y-6">
              <ProjectOverview />
              <ProductivityChart />
            </div>
          </TabsContent>
          
          <TabsContent value="productivity">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {productivityStats.map((stat, index) => (
                  <Card key={index} className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        {stat.title}
                      </CardTitle>
                      <CardDescription>
                        Target: {stat.target} {stat.unit}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-baseline mb-2">
                        <div className="text-3xl font-bold">
                          {stat.value} <span className="text-base font-normal text-muted-foreground">{stat.unit}</span>
                        </div>
                        <div className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </div>
                      </div>
                      <Progress value={stat.progress} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <ProductivityChart />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="border-none shadow-sm h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Project Utilization Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Website Redesign", utilization: 95, billable: 38, color: "#ec174c" },
                          { name: "Mobile App Development", utilization: 87, billable: 31, color: "#3c6df0" },
                          { name: "Branding Campaign", utilization: 78, billable: 24, color: "#24A148" },
                          { name: "Internal Tools", utilization: 64, billable: 18, color: "#8A3FFC" }
                        ].map((project, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{project.name}</span>
                              <span className="text-muted-foreground">{project.utilization}% utilization</span>
                            </div>
                            <Progress 
                              value={project.utilization} 
                              className="h-2" 
                              indicatorClassName={`bg-[${project.color}]`}
                            />
                            <div className="text-xs text-muted-foreground">
                              {project.billable} billable hours this week
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="border-none shadow-sm h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Time Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 pt-4">
                        {[
                          { name: "Client Work", percentage: 72, color: "#ec174c" },
                          { name: "Meetings", percentage: 14, color: "#3c6df0" },
                          { name: "Admin", percentage: 8, color: "#24A148" },
                          { name: "Learning", percentage: 6, color: "#8A3FFC" }
                        ].map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                              <span>{category.name}</span>
                            </div>
                            <span className="font-medium">{category.percentage}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-1">Optimal time allocation</div>
                          <div className="text-lg font-medium">75% Client / 25% Internal</div>
                          <div className="text-sm text-muted-foreground mt-1">You're currently at 72% client time</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
