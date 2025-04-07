
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import KanbanTask from "./KanbanTask";
import KanbanAddTask from "./KanbanAddTask";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

interface KanbanColumnProps {
  title: string;
  columnId: string;
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
}

const KanbanColumn = ({ title, columnId, tasks, onAddTask }: KanbanColumnProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const handleAddTask = (task: Omit<Task, "id">) => {
    onAddTask(task);
    setIsAddingTask(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-w-[320px]">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <div className="text-sm px-2 py-0.5 bg-gray-100 rounded">
            {tasks.length}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => setIsAddingTask(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-2 flex-1 overflow-y-auto">
        {isAddingTask && (
          <KanbanAddTask 
            onAddTask={handleAddTask}
            onCancel={() => setIsAddingTask(false)}
          />
        )}
        
        {tasks.map((task) => (
          <KanbanTask 
            key={task.id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
