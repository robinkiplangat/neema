
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeDistributionCategory {
  name: string;
  percentage: number;
  color: string;
}

interface TimeDistributionProps {
  categories: TimeDistributionCategory[];
}

const TimeDistribution = ({ categories }: TimeDistributionProps) => {
  return (
    <Card className="border shadow-sm bg-white/80 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Time Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <span>{category.name}</span>
              </div>
              <span className="font-medium">{category.percentage}%</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Optimal time allocation</div>
            <div className="text-lg font-medium">75% Client / 25% Internal</div>
            <div className="text-sm text-muted-foreground mt-1">You're currently at 72% client time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeDistribution;
