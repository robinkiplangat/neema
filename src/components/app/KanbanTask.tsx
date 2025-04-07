
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

interface KanbanTaskProps {
  task: Task;
}

const KanbanTask = ({ task }: KanbanTaskProps) => {
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Calculate if due date is past
  const isPastDue = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today;
  };

  return (
    <div className="bg-white rounded-md border shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow">
      <h4 className="font-medium mb-2">{task.title}</h4>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
          {task.priority}
        </Badge>
        
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs bg-magnetic-100 text-magnetic-700">
            {getInitials(task.assignee)}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex items-center mt-3 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3 mr-1" />
        <span className={isPastDue() ? 'text-red-500 font-medium' : ''}>
          {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
};

export default KanbanTask;
