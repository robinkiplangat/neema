import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, AlertCircle, Calendar, Clock, MoreVertical, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  context?: string;
}

const TasksTabContent = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete Neema MVP wireframes",
      completed: false,
      priority: "high",
      dueDate: "2023-09-10",
      context: "Development"
    },
    {
      id: "2",
      title: "Prepare investor pitch deck",
      completed: false,
      priority: "high",
      dueDate: "2023-09-15",
      context: "Business"
    },
    {
      id: "3",
      title: "Interview potential developers",
      completed: false,
      priority: "medium",
      dueDate: "2023-09-18",
      context: "Hiring"
    },
    {
      id: "4",
      title: "Review competitor analysis",
      completed: true,
      priority: "medium",
      dueDate: "2023-09-05",
      context: "Research"
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        priority: "medium",
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "low":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredTasks = filterPriority
    ? tasks.filter(task => task.priority === filterPriority)
    : tasks;

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1"
          />
          <Button onClick={handleAddTask}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterPriority(null)}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("high")}>
                High Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("medium")}>
                Medium Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("low")}>
                Low Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 border rounded-md flex items-start gap-3 transition-colors ${
                task.completed
                  ? "bg-muted/50 text-muted-foreground"
                  : "bg-white"
              }`}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={task.completed ? "line-through" : ""}>
                    {task.title}
                  </span>
                  {getPriorityIcon(task.priority)}
                </div>
                {task.dueDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                    {task.context && ` • ${task.context}`}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Set Priority</DropdownMenuItem>
                  <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  <DropdownMenuItem>Add to Project</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksTabContent; 