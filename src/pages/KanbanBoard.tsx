
import { useState } from "react";
import { Helmet } from "react-helmet";
import AppLayout from "@/components/app/AppLayout";
import KanbanColumn from "@/components/app/KanbanColumn";
import KanbanHeader from "@/components/app/KanbanHeader";
import { useToast } from "@/hooks/use-toast";

// Sample data
const initialTasks = {
  todo: [
    {
      id: "1",
      title: "Research competitor platforms",
      description: "Analyze features and pricing of main competitors",
      priority: "medium",
      assignee: "Emily Chen",
      dueDate: "2025-04-15"
    },
    {
      id: "2",
      title: "Create wireframes for mobile views",
      description: "Focus on responsive design for dashboard",
      priority: "high",
      assignee: "Alex Johnson",
      dueDate: "2025-04-10"
    },
    {
      id: "3",
      title: "Define API requirements",
      description: "Document endpoints needed for the frontend",
      priority: "medium",
      assignee: "Sam Lee",
      dueDate: "2025-04-18"
    }
  ],
  inProgress: [
    {
      id: "4",
      title: "Implement authentication flow",
      description: "Build login, signup, and password reset",
      priority: "high",
      assignee: "Alex Johnson",
      dueDate: "2025-04-12"
    },
    {
      id: "5",
      title: "Design system components",
      description: "Create reusable UI components with proper documentation",
      priority: "medium",
      assignee: "Emily Chen",
      dueDate: "2025-04-14"
    }
  ],
  review: [
    {
      id: "6",
      title: "User testing session",
      description: "Conduct usability tests with 5 participants",
      priority: "low",
      assignee: "Jordan Williams",
      dueDate: "2025-04-08"
    },
    {
      id: "7",
      title: "Code review for PR #42",
      description: "Review new feature implementation and provide feedback",
      priority: "medium",
      assignee: "Sam Lee",
      dueDate: "2025-04-09"
    }
  ],
  done: [
    {
      id: "8",
      title: "Project kickoff meeting",
      description: "Define scope and initial timeline",
      priority: "high",
      assignee: "Jordan Williams",
      dueDate: "2025-04-01"
    },
    {
      id: "9",
      title: "Setup development environment",
      description: "Configure CI/CD pipeline and development workflow",
      priority: "medium",
      assignee: "Alex Johnson",
      dueDate: "2025-04-03"
    }
  ]
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedProject, setSelectedProject] = useState("Website Redesign");
  const { toast } = useToast();
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const column = [...tasks[source.droppableId]];
      const [removed] = column.splice(source.index, 1);
      column.splice(destination.index, 0, removed);
      
      setTasks({
        ...tasks,
        [source.droppableId]: column
      });
    } else {
      // Moving from one column to another
      const sourceColumn = [...tasks[source.droppableId]];
      const destColumn = [...tasks[destination.droppableId]];
      
      const [removed] = sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, removed);
      
      setTasks({
        ...tasks,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn
      });
      
      toast({
        title: "Task moved",
        description: `Task moved to ${destination.droppableId}`
      });
    }
  };
  
  const handleAddTask = (columnId, newTask) => {
    setTasks({
      ...tasks,
      [columnId]: [
        ...tasks[columnId], 
        {
          id: Date.now().toString(),
          ...newTask
        }
      ]
    });
    
    toast({
      title: "Task added",
      description: `New task added to ${columnId}`
    });
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Kanban Board | Magnetic</title>
      </Helmet>
      
      <div className="space-y-6">
        <KanbanHeader 
          selectedProject={selectedProject} 
          onProjectChange={setSelectedProject}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-6">
          <KanbanColumn 
            title="To Do" 
            columnId="todo" 
            tasks={tasks.todo}
            onAddTask={(task) => handleAddTask("todo", task)}
          />
          
          <KanbanColumn 
            title="In Progress" 
            columnId="inProgress" 
            tasks={tasks.inProgress}
            onAddTask={(task) => handleAddTask("inProgress", task)}
          />
          
          <KanbanColumn 
            title="Review" 
            columnId="review" 
            tasks={tasks.review}
            onAddTask={(task) => handleAddTask("review", task)}
          />
          
          <KanbanColumn 
            title="Done" 
            columnId="done" 
            tasks={tasks.done}
            onAddTask={(task) => handleAddTask("done", task)}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default KanbanBoard;
