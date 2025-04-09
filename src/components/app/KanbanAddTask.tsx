import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  title: string;
  description: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

interface KanbanAddTaskProps {
  onAddTask: (task: Task) => void;
  onCancel: () => void;
}

const KanbanAddTask = ({ onAddTask, onCancel }: KanbanAddTaskProps) => {
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    priority: "medium",
    assignee: "Alex Johnson",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(task);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  return (
    <div className="bg-white rounded-md border shadow-md p-3 mb-2">
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <Input
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Task title"
            required
          />
          
          <Textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Description"
            rows={2}
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Select 
              value={task.priority} 
              onValueChange={(value) => setTask({ ...task, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={task.assignee} 
              onValueChange={(value) => setTask({ ...task, assignee: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alex Johnson">Alex Johnson</SelectItem>
                <SelectItem value="Emily Chen">Emily Chen</SelectItem>
                <SelectItem value="Sam Lee">Sam Lee</SelectItem>
                <SelectItem value="Jordan Williams">Jordan Williams</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            required
          />
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              size="sm" 
              className="neema-button"
            >
              <Check className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default KanbanAddTask;
