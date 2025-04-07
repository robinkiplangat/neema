
import { ResponsiveContainer, ComposedChart as RechartsComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, Bar, Line } from "recharts";

interface ComposedChartProps {
  data: Array<{
    name: string;
    billable: number;
    nonBillable: number;
    target: number;
    utilization: number;
  }>;
}

const ComposedChart = ({ data }: ComposedChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsComposedChart
        data={data}
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
        <Area type="monotone" dataKey="billable" name="Billable Hours" yAxisId="left" fill="#FFE6EA" stroke="#FFE6EA" fillOpacity={0.6} />
        <Bar dataKey="nonBillable" name="Non-Billable" yAxisId="left" fill="#D0E8FF" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="utilization" name="Utilization %" yAxisId="right" stroke="#9F9EA1" strokeWidth={2} dot={{ r: 4 }} />
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
};

// Import CustomTooltip from the shared file
import { CustomTooltip } from "./ChartTooltip";

export default ComposedChart;
