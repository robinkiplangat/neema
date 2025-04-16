import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTabContent from "./OverviewTabContent";
import TasksTabContent from "./TasksTabContent";
import CommunicationTabContent from "./CommunicationTabContent";

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="bg-background border mb-2 shadow-sm">
        <TabsTrigger value="overview" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">Overview</TabsTrigger>
        <TabsTrigger value="tasks" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">Tasks</TabsTrigger>
        <TabsTrigger value="communication" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">Communication</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <OverviewTabContent />
      </TabsContent>
      
      <TabsContent value="tasks">
        <TasksTabContent />
      </TabsContent>
      
      <TabsContent value="communication">
        <CommunicationTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
