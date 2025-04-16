import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatWithNeema from "@/components/ChatWithNeema";
import TaskSummary from "./TaskSummary";
import CalendarPreview from "@/components/CalendarPreview";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowRight } from "lucide-react";

const OverviewTabContent = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Task Focus</span>
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">Top Priority</h3>
                <div className="bg-pastel-lightpink/10 border border-pastel-lightpink/20 rounded-md p-3">
                  <h4 className="font-medium">Complete Neema MVP wireframes</h4>
                  <p className="text-sm text-muted-foreground mt-1">Due today • Design</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">Up Next</h3>
                <div className="bg-white border rounded-md p-3">
                  <h4 className="font-medium">Prepare investor pitch deck</h4>
                  <p className="text-sm text-muted-foreground mt-1">Due in 5 days • Business</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarPreview />
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Chat with Neema</CardTitle>
        </CardHeader>
        <CardContent>
          <ChatWithNeema />
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTabContent;
