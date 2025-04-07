
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTabContent from "./OverviewTabContent";
import MyWorkTabContent from "./MyWorkTabContent";
import ProductivityTabContent from "./ProductivityTabContent";

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="bg-background border mb-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="my-work">My Work</TabsTrigger>
        <TabsTrigger value="productivity">Productivity</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <OverviewTabContent />
      </TabsContent>
      
      <TabsContent value="my-work">
        <MyWorkTabContent />
      </TabsContent>
      
      <TabsContent value="productivity">
        <ProductivityTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
