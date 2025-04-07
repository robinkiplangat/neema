
interface UtilizationGaugeProps {
  data: Array<{
    name: string;
    billable: number;
    nonBillable: number;
    target: number;
    utilization: number;
  }>;
}

const UtilizationGauge = ({ data }: UtilizationGaugeProps) => {
  // Calculate the average utilization for the selected time period
  const totalUtilization = data.reduce((sum, item) => sum + item.utilization, 0);
  const avgUtilization = Math.round(totalUtilization / data.filter(item => item.utilization > 0).length);
  
  // Find the top productive day
  const topDay = data.reduce(
    (max, item) => item.utilization > max.utilization ? item : max, 
    { name: "", utilization: 0 }
  );
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-4">Average Utilization</h3>
        <div className="text-6xl font-bold mb-4 text-pastel-mint">{avgUtilization}%</div>
        <div className="text-sm text-muted-foreground">
          {avgUtilization >= 85 ? "Excellent" : 
          avgUtilization >= 75 ? "Good" : 
          avgUtilization >= 65 ? "Average" : "Needs Improvement"}
        </div>
      </div>
      <div className="mt-6 text-center">
        <h4 className="text-sm font-medium mb-2">Top Productive Day</h4>
        <div className="text-lg">
          {topDay.name} - {topDay.utilization}%
        </div>
      </div>
    </div>
  );
};

export default UtilizationGauge;
