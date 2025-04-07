
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectUtilizationProps {
  projects: Array<{
    name: string;
    utilization: number;
    billable: number;
    color: string;
  }>;
}

const ProjectUtilization = ({ projects }: ProjectUtilizationProps) => {
  return (
    <Card className="border shadow-sm bg-white/80 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Project Utilization Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">{project.name}</span>
                <span className="text-muted-foreground">{project.utilization}% utilization</span>
              </div>
              <Progress 
                value={project.utilization} 
                className="h-2" 
                indicatorClassName={project.color}
              />
              <div className="text-xs text-muted-foreground">
                {project.billable} billable hours this week
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectUtilization;
