import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const mockTasks = [
  { id: 1, title: "Complete project proposal", priority: "high", dueDate: "2023-06-15", status: "in_progress" },
  { id: 2, title: "Review client feedback", priority: "medium", dueDate: "2023-06-16", status: "todo" },
  { id: 3, title: "Update documentation", priority: "low", dueDate: "2023-06-20", status: "todo" },
  { id: 4, title: "Prepare presentation", priority: "high", dueDate: "2023-06-14", status: "done" },
];

const TaskSummary = () => {
  const [tasks] = useState(mockTasks);
  
  const highPriorityTasks = tasks.filter(task => task.priority === "high" && task.status !== "done");
  const tasksDueToday = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate === today && task.status !== "done";
  });
  const completedTasks = tasks.filter(task => task.status === "done");
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "todo": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Task Summary</h2>
        <Button size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks need attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksDueToday.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks to complete today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks finished this week</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {task.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/kanban?task=${task.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSummary; 