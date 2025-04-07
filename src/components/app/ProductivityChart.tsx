
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
  Legend 
} from "recharts";

const ProductivityChart = () => {
  const productivityData = [
    { name: "Mon", billable: 6.5, nonBillable: 1.5, target: 8 },
    { name: "Tue", billable: 7.8, nonBillable: 0.8, target: 8 },
    { name: "Wed", billable: 5.2, nonBillable: 2.4, target: 8 },
    { name: "Thu", billable: 7.0, nonBillable: 1.0, target: 8 },
    { name: "Fri", billable: 6.8, nonBillable: 1.2, target: 8 },
    { name: "Sat", billable: 0.5, nonBillable: 0.2, target: 0 },
    { name: "Sun", billable: 0, nonBillable: 0, target: 0 },
  ];

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Productivity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={{
              billable: { color: "#ec174c" },
              nonBillable: { color: "#3c6df0" },
              target: { color: "#aaaaaa" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productivityData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="billable" name="Billable Hours" stackId="a" fill="var(--color-billable)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nonBillable" name="Non-Billable Hours" stackId="a" fill="var(--color-nonBillable)" radius={[4, 4, 0, 0]} />
                {/* <Bar dataKey="target" name="Target Hours" fill="var(--color-target)" /> */}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const totalHours = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
              <span>{entry.name}</span>
            </div>
            <span className="font-medium">{entry.value}h</span>
          </div>
        ))}
        <div className="mt-1 pt-1 border-t">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{totalHours}h</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProductivityChart;
