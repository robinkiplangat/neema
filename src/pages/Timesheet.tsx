
import { useState } from "react";
import { Helmet } from "react-helmet";
import AppLayout from "@/components/app/AppLayout";
import TimesheetTable from "@/components/app/TimesheetTable";
import TimesheetHeader from "@/components/app/TimesheetHeader";
import TimesheetSummary from "@/components/app/TimesheetSummary";
import { useToast } from "@/components/ui/use-toast";

// Sample data
const initialEntries = [
  {
    id: "1",
    project: "Website Redesign",
    task: "Homepage UI Development",
    date: "2025-04-01",
    startTime: "09:00",
    endTime: "12:30",
    duration: "3h 30m",
    notes: "Implemented new hero section and navigation",
  },
  {
    id: "2",
    project: "Mobile App",
    task: "User Authentication",
    date: "2025-04-02",
    startTime: "10:15",
    endTime: "16:45",
    duration: "6h 30m",
    notes: "Added social login options and fixed password reset flow",
  },
  {
    id: "3",
    project: "Internal Dashboard",
    task: "Analytics Module",
    date: "2025-04-03",
    startTime: "13:00",
    endTime: "17:00",
    duration: "4h 00m",
    notes: "Created data visualization components using Recharts",
  },
  {
    id: "4",
    project: "Website Redesign",
    task: "Responsive Testing",
    date: "2025-04-04",
    startTime: "09:30",
    endTime: "13:45",
    duration: "4h 15m",
    notes: "Fixed layout issues on tablet and mobile views",
  },
  {
    id: "5",
    project: "Mobile App",
    task: "Push Notifications",
    date: "2025-04-05",
    startTime: "14:00",
    endTime: "18:00",
    duration: "4h 00m",
    notes: "Integrated Firebase Cloud Messaging for notifications",
  },
  {
    id: "6",
    project: "Internal Dashboard",
    task: "User Management",
    date: "2025-04-07",
    startTime: "10:00",
    endTime: "15:30",
    duration: "5h 30m",
    notes: "Built role-based access controls and user invite flow",
  },
];

const Timesheet = () => {
  const [entries, setEntries] = useState(initialEntries);
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const { toast } = useToast();
  
  const handleAddEntry = (newEntry: any) => {
    setEntries([...entries, { id: String(entries.length + 1), ...newEntry }]);
    toast({
      title: "Time entry added",
      description: `Added ${newEntry.duration} for ${newEntry.project}`,
    });
  };
  
  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast({
      title: "Time entry deleted",
      description: "The time entry has been removed",
    });
  };
  
  const handleExport = () => {
    toast({
      title: "Timesheet exported",
      description: "The timesheet has been exported as CSV",
    });
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Timesheet | Magnetic</title>
      </Helmet>
      
      <div className="space-y-6">
        <TimesheetHeader 
          selectedWeek={selectedWeek} 
          onWeekChange={setSelectedWeek}
          onExport={handleExport}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <TimesheetTable 
              entries={entries} 
              onAddEntry={handleAddEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>
          <div>
            <TimesheetSummary entries={entries} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Timesheet;
