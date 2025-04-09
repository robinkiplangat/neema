import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BarChart3 } from "lucide-react";

interface TimesheetEntry {
  id: string;
  project: string;
  task: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  notes: string;
}

interface TimesheetSummaryProps {
  entries: TimesheetEntry[];
}

const TimesheetSummary = ({ entries }: TimesheetSummaryProps) => {
  // Calculate total hours
  const calculateTotalHours = () => {
    let totalMinutes = 0;
    
    entries.forEach((entry) => {
      const durationParts = entry.duration.split(' ');
      const hours = parseInt(durationParts[0].replace('h', '')) || 0;
      const minutes = parseInt(durationParts[1]?.replace('m', '')) || 0;
      
      totalMinutes += (hours * 60) + minutes;
    });
    
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    return `${totalHours}h ${remainingMinutes}m`;
  };
  
  // Calculate hours by project
  const calculateProjectHours = () => {
    const projectHours: Record<string, number> = {};
    
    entries.forEach((entry) => {
      const durationParts = entry.duration.split(' ');
      const hours = parseInt(durationParts[0].replace('h', '')) || 0;
      const minutes = parseInt(durationParts[1]?.replace('m', '')) || 0;
      const totalMinutes = (hours * 60) + minutes;
      
      if (projectHours[entry.project]) {
        projectHours[entry.project] += totalMinutes;
      } else {
        projectHours[entry.project] = totalMinutes;
      }
    });
    
    // Convert minutes back to hours and minutes format
    const result: { project: string; duration: string; minutes: number }[] = [];
    
    Object.entries(projectHours).forEach(([project, minutes]) => {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      result.push({
        project,
        duration: `${hours}h ${remainingMinutes}m`,
        minutes, // Keep raw minutes for sorting
      });
    });
    
    // Sort by most hours
    return result.sort((a, b) => b.minutes - a.minutes);
  };
  
  const totalHours = calculateTotalHours();
  const projectHours = calculateProjectHours();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-neema-500" />
          Time Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-md p-3 bg-gray-50">
            <div className="text-sm text-muted-foreground">Total Hours</div>
            <div className="text-2xl font-bold mt-1">{totalHours}</div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-neema-500" />
              <h3 className="font-medium">Hours by Project</h3>
            </div>
            
            <div className="space-y-3">
              {projectHours.map((item) => (
                <div key={item.project} className="flex justify-between items-center">
                  <div className="text-sm truncate max-w-[180px]" title={item.project}>
                    {item.project}
                  </div>
                  <div className="text-sm font-medium">{item.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimesheetSummary;
