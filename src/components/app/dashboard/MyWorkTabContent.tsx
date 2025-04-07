
import ProjectOverview from "@/components/app/ProjectOverview";
import ProductivityChart from "@/components/app/ProductivityChart";

const MyWorkTabContent = () => {
  return (
    <div className="space-y-6">
      <ProjectOverview />
      <ProductivityChart />
    </div>
  );
};

export default MyWorkTabContent;
