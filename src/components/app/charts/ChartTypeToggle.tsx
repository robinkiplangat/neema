
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Gauge } from "lucide-react";

interface ChartTypeToggleProps {
  chartType: string;
  onChartTypeChange: (type: string) => void;
}

const ChartTypeToggle = ({ chartType, onChartTypeChange }: ChartTypeToggleProps) => {
  return (
    <div className="flex bg-secondary rounded-md">
      <Button 
        variant={chartType === "stacked" ? "default" : "ghost"} 
        size="sm" 
        className="h-8"
        onClick={() => onChartTypeChange("stacked")}
      >
        <BarChart3 className="w-4 h-4 mr-1" />
        Stacked
      </Button>
      <Button 
        variant={chartType === "composed" ? "default" : "ghost"} 
        size="sm" 
        className="h-8"
        onClick={() => onChartTypeChange("composed")}
      >
        <TrendingUp className="w-4 h-4 mr-1" />
        Trends
      </Button>
      <Button 
        variant={chartType === "gauge" ? "default" : "ghost"} 
        size="sm" 
        className="h-8"
        onClick={() => onChartTypeChange("gauge")}
      >
        <Gauge className="w-4 h-4 mr-1" />
        Gauge
      </Button>
    </div>
  );
};

export default ChartTypeToggle;
