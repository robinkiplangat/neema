import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PlusCircle, AlertCircle, Calendar, Clock, MoreVertical, 
  Filter, Trash2, Edit, Star, Calendar as CalendarIcon 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import * as taskService from "@/services/taskService";
import * as aiService from "@/services/aiService";
import { useAI } from "@/context/AIContext";
import { Skeleton } from "@/components/ui/skeleton";

const TasksTabContent = () => {
  const { user } = useUser();
  const userId = user?.id || '';
  const { toast } = useToast();
  const { neemaContext, refreshContext } = useAI();
  
  const [tasks, setTasks] = useState<taskService.Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [taskStats, setTaskStats] = useState<{
    total: number;
    completed: number;
    highPriority: number;
    overdueCount: number;
  }>({
    total: 0,
    completed: 0,
    highPriority: 0,
    overdueCount: 0
  });

  // Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const [fetchedTasks, stats] = await Promise.all([
            taskService.fetchTasks(userId),
            taskService.fetchTaskStats(userId)
          ]);
          setTasks(fetchedTasks);
          setTaskStats(stats);
        } catch (error) {
          console.error('Error loading tasks:', error);
          toast({
            title: "Failed to load tasks",
            description: "Please try again later",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadTasks();
  }, [userId, toast]);

  const handleAddTask = async () => {
    if (newTaskTitle.trim() && userId) {
      setIsLoading(true);
      
      const newTask = {
        title: newTaskTitle,
        completed: false,
        priority: "medium" as const,
        userId
      };
      
      try {
        const createdTask = await taskService.createTask(newTask);
        if (createdTask) {
          setTasks([...tasks, createdTask]);
          setNewTaskTitle("");
          
          // Refresh task stats
          const stats = await taskService.fetchTaskStats(userId);
          setTaskStats(stats);
          
          // Refresh AI context
          refreshContext();
          
          toast({
            title: "Task added",
            description: "New task has been created"
          });
        }
      } catch (error) {
        console.error('Error creating task:', error);
        toast({
          title: "Failed to create task",
          description: "Please try again",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      try {
        const updated = await taskService.updateTask(taskId, { 
          completed: !task.completed 
        });
        
        if (updated) {
          setTasks(tasks.map((t) => t.id === taskId ? updated : t));
          
          // Refresh task stats
          const stats = await taskService.fetchTaskStats(userId);
          setTaskStats(stats);
          
          // Refresh AI context
          refreshContext();
          
          toast({
            title: updated.completed ? "Task completed" : "Task reopened",
            description: updated.title,
          });
        }
      } catch (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Failed to update task",
          description: "Please try again",
          variant: "destructive"
        });
      }
    }
  };
  
  const deleteTask = async (taskId: string) => {
    try {
      const success = await taskService.deleteTask(taskId);
      
      if (success) {
        setTasks(tasks.filter(task => task.id !== taskId));
        
        // Refresh task stats
        const stats = await taskService.fetchTaskStats(userId);
        setTaskStats(stats);
        
        // Refresh AI context
        refreshContext();
        
        toast({
          title: "Task deleted",
          description: "The task has been removed"
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Failed to delete task",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  const updateTaskPriority = async (taskId: string, priority: "high" | "medium" | "low") => {
    try {
      const updated = await taskService.updateTask(taskId, { priority });
      
      if (updated) {
        setTasks(tasks.map((t) => t.id === taskId ? updated : t));
        
        // Refresh AI context
        refreshContext();
        
        toast({
          title: "Priority updated",
          description: `Task is now ${priority} priority`
        });
      }
    } catch (error) {
      console.error('Error updating task priority:', error);
      toast({
        title: "Failed to update priority",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  const prioritizeTasks = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "AI is prioritizing tasks",
        description: "This may take a moment..."
      });
      
      // Use AI to prioritize tasks
      const prioritizedTasks = await aiService.prioritizeTaskList(
        tasks,
        neemaContext
      );
      
      // Update all tasks with new priorities
      const updatePromises = prioritizedTasks.map(task => 
        taskService.updateTask(task.id, { priority: task.priority })
      );
      
      await Promise.all(updatePromises);
      
      // Refresh tasks
      const fetchedTasks = await taskService.fetchTasks(userId);
      setTasks(fetchedTasks);
      
      // Refresh AI context
      refreshContext();
      
      toast({
        title: "Tasks prioritized",
        description: "Your tasks have been intelligently prioritized"
      });
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
      toast({
        title: "Failed to prioritize tasks",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
    const aPriority = priorityOrder[a.priority] || 1;
    const bPriority = priorityOrder[b.priority] || 1;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // Then by due date if available
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    
    return 0;
  });
  
  const isOverdue = (task: taskService.Task) => {
    if (!task.dueDate || task.completed) return false;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };

  return (
    <div className="space-y-6">
      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Total Tasks</div>
            <div className="text-2xl font-bold">{taskStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Completed</div>
            <div className="text-2xl font-bold">{taskStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">High Priority</div>
            <div className="text-2xl font-bold text-red-500">{taskStats.highPriority}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Overdue</div>
            <div className="text-2xl font-bold text-amber-500">{taskStats.overdueCount}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Task Management */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddTask} disabled={isLoading || !newTaskTitle.trim()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isLoading}>
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
            <Button variant="outline" onClick={prioritizeTasks} disabled={isLoading || tasks.length === 0}>
              <Star className="h-4 w-4 mr-2" />
              AI Prioritize
            </Button>
          </div>
        </div>

        {isLoading ? (
          // Loading skeletons
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-md flex items-start gap-3">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 border rounded-md flex items-start gap-3 transition-colors ${
                    task.completed
                      ? "bg-muted/50 text-muted-foreground"
                      : isOverdue(task)
                      ? "bg-red-50 border-red-200"
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
                      {isOverdue(task) && !task.completed && (
                        <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                    {task.dueDate && (
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
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
                      <DropdownMenuItem onClick={() => toggleTaskCompletion(task.id)}>
                        {task.completed ? (
                          <>
                            <Clock className="h-4 w-4 mr-2" />
                            Reopen Task
                          </>
                        ) : (
                          <>
                            <Checkbox className="h-4 w-4 mr-2" />
                            Mark Complete
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Set Due Date
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateTaskPriority(task.id, "high")}>
                        <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                        High Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateTaskPriority(task.id, "medium")}>
                        <Clock className="h-4 w-4 mr-2 text-amber-500" />
                        Medium Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateTaskPriority(task.id, "low")}>
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        Low Priority
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {filterPriority ? (
                  <p>No {filterPriority} priority tasks found</p>
                ) : (
                  <p>No tasks yet. Add your first task above!</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksTabContent; 