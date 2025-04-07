
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import StackedBarChart from "./charts/StackedBarChart";
import ComposedChart from "./charts/ComposedChart";
import UtilizationGauge from "./charts/UtilizationGauge";
import ChartTypeToggle from "./charts/ChartTypeToggle";
import TimeRangeSelector from "./charts/TimeRangeSelector";
import { getChartData } from "./charts/ChartData";

const ProductivityChart = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [chartType, setChartType] = useState("stacked");
  
  const data = getChartData(timeRange);

  const renderChart = () => {
    switch(chartType) {
      case "stacked": 
        return <StackedBarChart data={data} />;
      case "composed": 
        return <ComposedChart data={data} />;
      case "gauge": 
        return <UtilizationGauge data={data} />;
      default:
        return <StackedBarChart data={data} />;
    }
  };

  return (
    <Card className="border-none shadow-sm bg-white/80">
      <CardHeader className="pb-2 flex flex-row justify-between items-center space-x-4 flex-wrap gap-2">
        <CardTitle className="text-lg font-medium">Productivity Overview</CardTitle>
        <div className="flex items-center gap-3">
          <ChartTypeToggle 
            chartType={chartType} 
            onChartTypeChange={setChartType} 
          />
          <TimeRangeSelector 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer
            config={{
              billable: { color: "#D4F5E9" },
              nonBillable: { color: "#E4D7F5" },
              target: { color: "#aaadb0" },
              utilization: { color: "#8E9196" }
            }}
          >
            {renderChart()}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityChart;
