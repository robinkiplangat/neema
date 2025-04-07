
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProductivityStat {
  title: string;
  value: number;
  target: number;
  unit: string;
  progress: number;
  change: string;
  trend: "up" | "down";
}

interface ProductivityStatsProps {
  stats: ProductivityStat[];
}

const ProductivityStats = ({ stats }: ProductivityStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border shadow-sm bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {stat.title}
            </CardTitle>
            <CardDescription>
              Target: {stat.target} {stat.unit}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-3xl font-bold">
                {stat.value} <span className="text-base font-normal text-muted-foreground">{stat.unit}</span>
              </div>
              <div className={`text-sm font-medium ${stat.trend === 'up' ? 'text-pastel-mint' : 'text-pastel-coral'}`}>
                {stat.change}
              </div>
            </div>
            <Progress 
              value={stat.progress} 
              className="h-2" 
              indicatorClassName={stat.trend === 'up' ? 'bg-pastel-mint' : 'bg-pastel-coral'} 
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductivityStats;
