import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
// You can use your preferred calendar library, e.g. react-big-calendar, FullCalendar, etc.
// For now, this is a placeholder for a calendar view of tasks.

const Schedule: React.FC = () => {
  return (
    <Card className="border shadow-sm bg-white/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Integrate calendar view and fetch tasks from backend */}
        <div className="text-center py-12 text-muted-foreground">
          Calendar integration coming soon.
        </div>
      </CardContent>
    </Card>
  );
};

export default Schedule;
