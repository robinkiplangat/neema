import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface TimesheetTableProps {
  entries: TimesheetEntry[];
  onAddEntry: (entry: Omit<TimesheetEntry, "id">) => void;
  onDeleteEntry: (id: string) => void;
}

const TimesheetTable = ({ entries, onAddEntry, onDeleteEntry }: TimesheetTableProps) => {
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    project: "Website Redesign",
    task: "Development",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "17:00",
    duration: "8h 00m",
    notes: "",
  });

  const handleAddEntry = () => {
    onAddEntry(newEntry);
    setIsAddingEntry(false);
    // Reset form
    setNewEntry({
      project: "Website Redesign",
      task: "Development",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "17:00",
      duration: "8h 00m",
      notes: "",
    });
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-medium">Time Entries</h2>
        {!isAddingEntry && (
          <Button 
            variant="outline" 
            onClick={() => setIsAddingEntry(true)}
            className="text-neema-600 border-neema-200 hover:bg-neema-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAddingEntry && (
              <TableRow>
                <TableCell>
                  <Select 
                    value={newEntry.project} 
                    onValueChange={(value) => setNewEntry({ ...newEntry, project: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App">Mobile App</SelectItem>
                      <SelectItem value="Internal Dashboard">Internal Dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select 
                    value={newEntry.task} 
                    onValueChange={(value) => setNewEntry({ ...newEntry, task: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input 
                    type="date" 
                    value={newEntry.date} 
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="time" 
                    value={newEntry.startTime} 
                    onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="time" 
                    value={newEntry.endTime} 
                    onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={newEntry.duration} 
                    onChange={(e) => setNewEntry({ ...newEntry, duration: e.target.value })}
                    placeholder="e.g. 2h 30m"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={newEntry.notes} 
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="Optional notes..."
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleAddEntry}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsAddingEntry(false)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.project}</TableCell>
                <TableCell>{entry.task}</TableCell>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>{entry.startTime}</TableCell>
                <TableCell>{entry.endTime}</TableCell>
                <TableCell>
                  <span className="font-medium">{entry.duration}</span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={entry.notes}>
                  {entry.notes}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TimesheetTable;
