
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  Line,
  ComposedChart,
  Area
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Activity, Gauge } from "lucide-react";

const ProductivityChart = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [chartType, setChartType] = useState("stacked");
  
  // Weekly data
  const weeklyData = [
    { name: "Mon", billable: 6.5, nonBillable: 1.5, target: 8, utilization: 81 },
    { name: "Tue", billable: 7.8, nonBillable: 0.8, target: 8, utilization: 97 },
    { name: "Wed", billable: 5.2, nonBillable: 2.4, target: 8, utilization: 65 },
    { name: "Thu", billable: 7.0, nonBillable: 1.0, target: 8, utilization: 87 },
    { name: "Fri", billable: 6.8, nonBillable: 1.2, target: 8, utilization: 85 },
    { name: "Sat", billable: 0.5, nonBillable: 0.2, target: 0, utilization: 0 },
    { name: "Sun", billable: 0, nonBillable: 0, target: 0, utilization: 0 },
  ];
  
  // Monthly data
  const monthlyData = [
    { name: "Week 1", billable: 32.0, nonBillable: 6.3, target: 40, utilization: 80 },
    { name: "Week 2", billable: 35.4, nonBillable: 4.5, target: 40, utilization: 88 },
    { name: "Week 3", billable: 28.6, nonBillable: 8.2, target: 40, utilization: 71 },
    { name: "Week 4", billable: 33.8, nonBillable: 5.4, target: 40, utilization: 84 },
  ];
  
  // Quarterly data
  const quarterlyData = [
    { name: "Jan", billable: 140, nonBillable: 24, target: 168, utilization: 83 },
    { name: "Feb", billable: 126, nonBillable: 30, target: 160, utilization: 78 },
    { name: "Mar", billable: 150, nonBillable: 18, target: 168, utilization: 89 },
  ];
  
  const getData = () => {
    switch(timeRange) {
      case "week": return weeklyData;
      case "month": return monthlyData;
      case "quarter": return quarterlyData;
      default: return weeklyData;
    }
  };

  const renderStackedBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={getData()}
        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        barSize={timeRange === "week" ? 30 : 40}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fill: '#888' }} />
        <YAxis 
          yAxisId="left"
          label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#888' } }}
          tick={{ fill: '#888' }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[0, 100]}
          label={{ value: 'Utilization %', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#888' } }}
          tick={{ fill: '#888' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 10 }} />
        <Bar dataKey="billable" name="Billable Hours" yAxisId="left" stackId="a" fill="#ec174c" radius={[4, 4, 0, 0]} />
        <Bar dataKey="nonBillable" name="Non-Billable" yAxisId="left" stackId="a" fill="#3c6df0" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderComposedChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={getData()}
        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fill: '#888' }} />
        <YAxis 
          yAxisId="left"
          label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#888' } }}
          tick={{ fill: '#888' }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[0, 100]}
          label={{ value: 'Utilization %', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#888' } }}
          tick={{ fill: '#888' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 10 }} />
        <Area type="monotone" dataKey="billable" name="Billable Hours" yAxisId="left" fill="#ec174c" stroke="#ec174c" fillOpacity={0.2} />
        <Bar dataKey="nonBillable" name="Non-Billable" yAxisId="left" fill="#3c6df0" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="utilization" name="Utilization %" yAxisId="right" stroke="#24A148" strokeWidth={2} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderUtilizationGauge = () => {
    const data = getData();
    // Calculate the average utilization for the selected time period
    const totalUtilization = data.reduce((sum, item) => sum + item.utilization, 0);
    const avgUtilization = Math.round(totalUtilization / data.filter(item => item.utilization > 0).length);
    
    // Static gauge data
    const gaugeData = [
      { name: "Poor", value: 25, color: "#ff4d4f" },
      { name: "Average", value: 25, color: "#faad14" }, 
      { name: "Good", value: 25, color: "#52c41a" },
      { name: "Excellent", value: 25, color: "#13c2c2" },
      { name: "Current", value: avgUtilization, color: "#ec174c" }
    ];
    
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-4">Average Utilization</h3>
          <div className="text-6xl font-bold mb-4 text-primary">{avgUtilization}%</div>
          <div className="text-sm text-muted-foreground">
            {avgUtilization >= 85 ? "Excellent" : 
             avgUtilization >= 75 ? "Good" : 
             avgUtilization >= 65 ? "Average" : "Needs Improvement"}
          </div>
        </div>
        <div className="mt-6 text-center">
          <h4 className="text-sm font-medium mb-2">Top Productive Day</h4>
          <div className="text-lg">
            {data.reduce((max, item) => item.utilization > max.utilization ? item : max, { name: "", utilization: 0 }).name} - 
            {data.reduce((max, item) => item.utilization > max.utilization ? item : max, { name: "", utilization: 0 }).utilization}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Productivity Overview</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex bg-secondary rounded-md">
            <Button 
              variant={chartType === "stacked" ? "default" : "ghost"} 
              size="sm" 
              className="h-8"
              onClick={() => setChartType("stacked")}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Stacked
            </Button>
            <Button 
              variant={chartType === "composed" ? "default" : "ghost"} 
              size="sm" 
              className="h-8"
              onClick={() => setChartType("composed")}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trends
            </Button>
            <Button 
              variant={chartType === "gauge" ? "default" : "ghost"} 
              size="sm" 
              className="h-8"
              onClick={() => setChartType("gauge")}
            >
              <Gauge className="w-4 h-4 mr-1" />
              Gauge
            </Button>
          </div>
          <Select 
            value={timeRange} 
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={{
              billable: { color: "#ec174c" },
              nonBillable: { color: "#3c6df0" },
              target: { color: "#aaaaaa" },
              utilization: { color: "#24A148" }
            }}
          >
            {chartType === "stacked" && renderStackedBarChart()}
            {chartType === "composed" && renderComposedChart()}
            {chartType === "gauge" && renderUtilizationGauge()}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const billableHours = payload.find((p: any) => p.name === "Billable Hours")?.value || 0;
    const nonBillableHours = payload.find((p: any) => p.name === "Non-Billable")?.value || 0;
    const utilization = payload.find((p: any) => p.name === "Utilization %")?.value;
    const totalHours = billableHours + nonBillableHours;
    
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium mb-1">{label}</p>
        <div className="grid gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                <span>{entry.name}</span>
              </div>
              <span className="font-medium">
                {entry.name.includes('%') ? `${entry.value}%` : `${entry.value}h`}
              </span>
            </div>
          ))}
          {!payload.find((p: any) => p.name === "Utilization %") && totalHours > 0 && (
            <div className="mt-1 pt-1 border-t">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{totalHours}h</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ProductivityChart;
