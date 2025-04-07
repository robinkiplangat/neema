
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface TimesheetHeaderProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  onExport: () => void;
}

const TimesheetHeader = ({ selectedWeek, onWeekChange, onExport }: TimesheetHeaderProps) => {
  const formatWeekRange = (date: Date) => {
    const currentDay = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diff = date.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust when day is Sunday
    
    const monday = new Date(date);
    monday.setDate(diff);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const mondayStr = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const sundayStr = sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return `${mondayStr} - ${sundayStr}`;
  };
  
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() - 7);
    onWeekChange(newDate);
  };
  
  const goToNextWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + 7);
    onWeekChange(newDate);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Timesheet</h1>
        <p className="text-muted-foreground">
          Track and manage your work hours
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-1 bg-white border rounded-md p-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToPreviousWeek}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 px-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {formatWeekRange(selectedWeek)}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToNextWeek}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default TimesheetHeader;
