
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Kanban, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Timesheet", href: "/timesheet", icon: <Clock className="h-5 w-5" /> },
    { name: "Schedule", href: "/schedule", icon: <Calendar className="h-5 w-5" /> },
    { name: "Projects", href: "/kanban", icon: <Kanban className="h-5 w-5" /> },
    { name: "Team", href: "/team", icon: <Users className="h-5 w-5" /> },
    { name: "Reports", href: "/reports", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-white/90 backdrop-blur-sm border-r border-border shadow-sm ${
          sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-pastel-lightpink flex items-center justify-center">
                <span className="text-pastel-pink font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">Magnetic</span>
            </Link>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <div className="px-4 pt-5 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="w-full pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto py-2">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    location.pathname === item.href
                      ? "bg-pastel-lightpink/20 text-primary font-medium"
                      : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.name}
                  </div>
                  {location.pathname === item.href && <ChevronRight className="h-4 w-4" />}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Alex Johnson</p>
                  <p className="text-xs text-muted-foreground">alex@company.com</p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Team Settings</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b py-3 px-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-pastel-lightpink flex items-center justify-center">
                <span className="text-pastel-pink font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-bold">Magnetic</span>
            </Link>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className={`flex-1 ${isMobile ? "pt-16" : ""}`} style={{ marginLeft: isMobile ? 0 : '16rem' }}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
