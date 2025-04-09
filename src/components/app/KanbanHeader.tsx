import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Filter, SlidersHorizontal } from "lucide-react";

interface KanbanHeaderProps {
  selectedProject: string;
  onProjectChange: (project: string) => void;
}

const KanbanHeader = ({ selectedProject, onProjectChange }: KanbanHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Board</h1>
        <p className="text-muted-foreground">
          Manage tasks and track progress
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Select value={selectedProject} onValueChange={onProjectChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Website Redesign">Website Redesign</SelectItem>
            <SelectItem value="Mobile App">Mobile App</SelectItem>
            <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button className="neema-button">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KanbanHeader;
