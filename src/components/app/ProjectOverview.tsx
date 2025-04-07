
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ProjectOverview = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      progress: 65,
      tasksCompleted: 13,
      totalTasks: 20,
      dueDate: "Apr 15, 2025",
      status: "On Track",
      statusColor: "text-green-600 bg-green-50",
      expanded: false
    },
    {
      id: 2,
      name: "Mobile App Development",
      progress: 40,
      tasksCompleted: 8,
      totalTasks: 18,
      dueDate: "May 20, 2025",
      status: "At Risk",
      statusColor: "text-amber-600 bg-amber-50",
      expanded: false
    },
    {
      id: 3,
      name: "Marketing Campaign",
      progress: 90,
      tasksCompleted: 9,
      totalTasks: 10,
      dueDate: "Apr 10, 2025",
      status: "On Track",
      statusColor: "text-green-600 bg-green-50",
      expanded: false
    },
  ]);

  const toggleExpand = (projectId: number) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, expanded: !p.expanded } : p
    ));
  };

  const completeTask = (projectId: number) => {
    setProjects(projects.map(p => {
      if (p.id === projectId && p.tasksCompleted < p.totalTasks) {
        const tasksCompleted = p.tasksCompleted + 1;
        const progress = Math.round((tasksCompleted / p.totalTasks) * 100);
        
        toast({
          title: "Task completed",
          description: `A task for "${p.name}" has been marked as complete.`,
        });
        
        return {
          ...p,
          tasksCompleted,
          progress,
          status: progress >= 90 ? "Nearly Done" : p.status,
          statusColor: progress >= 90 ? "text-blue-600 bg-blue-50" : p.statusColor
        };
      }
      return p;
    }));
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Project Overview</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1"
            onClick={() => {
              toast({
                title: "Create New Project",
                description: "Project creation functionality would open here.",
              });
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            New Project
          </Button>
          <Button variant="ghost" size="sm" asChild className="h-8 text-muted-foreground hover:text-foreground">
            <Link to="/projects" className="flex items-center">
              All Projects
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-border/60 rounded-lg p-4 hover:shadow-sm transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="font-medium flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-6 w-6 mr-1"
                    onClick={() => toggleExpand(project.id)}
                  >
                    {project.expanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  {project.name}
                </h3>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${project.statusColor}`}>
                  {project.status}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="bg-blue-100 h-1.5" indicatorClassName="bg-primary" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tasks</p>
                    <p className="font-medium">
                      {project.tasksCompleted}/{project.totalTasks}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium">{project.dueDate}</p>
                  </div>
                </div>
                
                {project.expanded && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">Actions</h4>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => completeTask(project.id)}
                        disabled={project.tasksCompleted >= project.totalTasks}
                      >
                        Complete Task
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => {
                          toast({
                            title: "View Details",
                            description: `Viewing details for "${project.name}"`,
                          });
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectOverview;
