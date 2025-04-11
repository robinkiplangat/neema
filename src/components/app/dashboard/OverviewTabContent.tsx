import OverviewStats from "@/components/app/OverviewStats";
import ProjectOverview from "@/components/app/ProjectOverview";
import ChatWithNeema from "@/components/ChatWithNeema";
import TaskSummary from "./TaskSummary";
import TimeDistribution from "./TimeDistribution";
import CalendarPreview from "@/components/CalendarPreview";

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
          <ChatWithNeema />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeDistribution categories={mockCategories} />
        <CalendarPreview />
      </div>
    </div>
  );
};

export default OverviewTabContent;
