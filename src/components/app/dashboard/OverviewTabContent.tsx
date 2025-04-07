
import OverviewStats from "@/components/app/OverviewStats";
import ProjectOverview from "@/components/app/ProjectOverview";
import RecentActivity from "@/components/app/RecentActivity";

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
    </div>
  );
};

export default OverviewTabContent;
