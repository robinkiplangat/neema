
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

const OverviewStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="pastel-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/20 to-pastel-blush/10 rounded-xl" />
        <CardContent className="pt-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hours tracked this week</p>
              <h3 className="text-2xl font-bold mt-1">32.5h</h3>
              <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +4.5h from last week
              </p>
            </div>
            <div className="bg-pastel-pink rounded-xl p-2.5">
              <Clock className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="pastel-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-mint/30 to-pastel-mint/10 rounded-xl" />
        <CardContent className="pt-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasks completed</p>
              <h3 className="text-2xl font-bold mt-1">24</h3>
              <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                78% completion rate
              </p>
            </div>
            <div className="bg-pastel-mint rounded-xl p-2.5">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="pastel-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-lavender/30 to-pastel-lavender/10 rounded-xl" />
        <CardContent className="pt-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Billable hours</p>
              <h3 className="text-2xl font-bold mt-1">27.5h</h3>
              <p className="text-sm text-muted-foreground mt-1">
                85% billable rate
              </p>
            </div>
            <div className="bg-pastel-lavender rounded-xl p-2.5">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="pastel-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-peach/30 to-pastel-peach/10 rounded-xl" />
        <CardContent className="pt-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming deadlines</p>
              <h3 className="text-2xl font-bold mt-1">5</h3>
              <p className="text-sm text-amber-600 font-medium mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                2 due this week
              </p>
            </div>
            <div className="bg-pastel-peach rounded-xl p-2.5">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewStats;
