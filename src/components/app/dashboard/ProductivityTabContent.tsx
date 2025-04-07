
import ProductivityStats from "./ProductivityStats";
import ProjectUtilization from "./ProjectUtilization";
import TimeDistribution from "./TimeDistribution";
import ProductivityChart from "../ProductivityChart";

const ProductivityTabContent = () => {
  const productivityStats = [
    { 
      title: "Weekly Billable", 
      value: 27.3, 
      target: 35, 
      unit: "hours",
      progress: 78,
      change: "+12%",
      trend: "up" as "up" 
    },
    { 
      title: "Utilization Rate", 
      value: 82, 
      target: 85, 
      unit: "%",
      progress: 96,
      change: "+5%",
      trend: "up" as "up" 
    },
    { 
      title: "On-time Delivery", 
      value: 92, 
      target: 95, 
      unit: "%",
      progress: 97,
      change: "-2%",
      trend: "down" as "down" 
    },
    { 
      title: "Client Satisfaction", 
      value: 4.8, 
      target: 5.0, 
      unit: "/5",
      progress: 96,
      change: "+0.2",
      trend: "up" as "up" 
    }
  ];

  const projects = [
    { name: "Website Redesign", utilization: 95, billable: 38, color: "bg-pastel-pink" },
    { name: "Mobile App Development", utilization: 87, billable: 31, color: "bg-pastel-sky" },
    { name: "Branding Campaign", utilization: 78, billable: 24, color: "bg-pastel-mint" },
    { name: "Internal Tools", utilization: 64, billable: 18, color: "bg-pastel-lilac" }
  ];

  const timeDistribution = [
    { name: "Client Work", percentage: 72, color: "bg-pastel-pink" },
    { name: "Meetings", percentage: 14, color: "bg-pastel-sky" },
    { name: "Admin", percentage: 8, color: "bg-pastel-mint" },
    { name: "Learning", percentage: 6, color: "bg-pastel-lilac" }
  ];

  return (
    <div className="space-y-6">
      <ProductivityStats stats={productivityStats} />
      <ProductivityChart />
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
