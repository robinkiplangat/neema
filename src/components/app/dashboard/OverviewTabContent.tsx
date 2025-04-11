import OverviewStats from "@/components/app/OverviewStats";
import ProjectOverview from "@/components/app/ProjectOverview";
import RecentActivity from "@/components/app/RecentActivity";
import TaskSummary from "./TaskSummary";
import TimeDistribution from "./TimeDistribution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const mockCategories = [
  { name: "Development", percentage: 35, color: "bg-pastel-pink" },
  { name: "Design", percentage: 20, color: "bg-pastel-sky" },
  { name: "Planning", percentage: 15, color: "bg-pastel-mint" },
  { name: "Meetings", percentage: 20, color: "bg-pastel-lilac" },
  { name: "Documentation", percentage: 10, color: "bg-pastel-yellow" }
];

const OverviewTabContent = () => {
  return (
    <div className="space-y-6">
      <OverviewStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectOverview />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeDistribution categories={mockCategories} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Calendar Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Calendar integration coming soon. This will show your upcoming events and deadlines.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTabContent;
