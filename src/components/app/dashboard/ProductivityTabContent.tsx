
import ProductivityStats from "./ProductivityStats";
import ProjectUtilization from "./ProjectUtilization";
import TimeDistribution from "./TimeDistribution";
import ProductivityChart from "../ProductivityChart";

const ProductivityTabContent = () => {
  const productivityStats = [
    { 
      title: "Focus Time", 
      value: 27.3, 
      target: 35, 
      unit: "hours",
      progress: 78,
      change: "+12%",
      trend: "up" as "up" 
    },
    { 
      title: "Task Completion", 
      value: 82, 
      target: 85, 
      unit: "%",
      progress: 96,
      change: "+5%",
      trend: "up" as "up" 
    },
    { 
      title: "Context Switching", 
      value: 42, 
      target: 30, 
      unit: "%",
      progress: 65,
      change: "-8%",
      trend: "down" as "down" 
    },
    { 
      title: "Work-Life Balance", 
      value: 3.8, 
      target: 5.0, 
      unit: "/5",
      progress: 76,
      change: "+0.3",
      trend: "up" as "up" 
    }
  ];

  const projects = [
    { name: "Content Creation", utilization: 95, billable: 38, color: "bg-pastel-pink" },
    { name: "Product Development", utilization: 87, billable: 31, color: "bg-pastel-sky" },
    { name: "Client Outreach", utilization: 78, billable: 24, color: "bg-pastel-mint" },
    { name: "Learning & Growth", utilization: 64, billable: 18, color: "bg-pastel-lilac" }
  ];

  const timeDistribution = [
    { name: "Deep Work", percentage: 42, color: "bg-pastel-pink" },
    { name: "Meetings", percentage: 18, color: "bg-pastel-sky" },
    { name: "Admin", percentage: 25, color: "bg-pastel-mint" },
    { name: "Learning", percentage: 15, color: "bg-pastel-lilac" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 p-4 rounded-xl border border-neema-secondary/20 mb-6">
        <h3 className="text-lg font-medium mb-2">🤖 Neema's Insights</h3>
        <p className="text-muted-foreground">Your focus time has increased by 12% this week. Consider batching email responses to further reduce context switching.</p>
      </div>
      
      <ProductivityStats stats={productivityStats} />
      
      <div className="flex justify-center w-full">
        <div className="w-[25%] min-w-[300px]">
          <ProductivityChart />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectUtilization projects={projects} />
        </div>
        <div>
          <TimeDistribution categories={timeDistribution} />
        </div>
      </div>
    </div>
  );
};

export default ProductivityTabContent;
