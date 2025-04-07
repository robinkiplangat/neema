
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

interface StackedBarChartProps {
  data: Array<{
    name: string;
    billable: number;
    nonBillable: number;
    target: number;
    utilization: number;
  }>;
}

const StackedBarChart = ({ data }: StackedBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
        barSize={data.length <= 7 ? 30 : 20}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fill: '#888' }} />
        <YAxis 
          yAxisId="left"
          label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#888' }, offset: 0 }}
          tick={{ fill: '#888' }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[0, 100]}
          label={{ value: 'Utilization %', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#888' }, offset: 0 }}
          tick={{ fill: '#888' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 20 }} />
        <Bar dataKey="billable" name="Billable Hours" yAxisId="left" stackId="a" fill="#D4F5E9" radius={[4, 4, 0, 0]} />
        <Bar dataKey="nonBillable" name="Non-Billable" yAxisId="left" stackId="a" fill="#E4D7F5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Import CustomTooltip from the shared file
import { CustomTooltip } from "./ChartTooltip";

export default StackedBarChart;
