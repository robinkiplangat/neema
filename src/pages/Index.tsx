
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar, BarChart3, Users, Trophy, LayoutGrid, LayoutDashboard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 relative overflow-hidden">
        <div className="section-container relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in leading-tight">
                <span className="text-primary">Track time,</span> <br/>
                manage projects <br/>
                with ease
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md animate-slide-up" style={{animationDelay: '0.2s'}}>
                The all-in-one platform for time tracking, project management, and team collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
                <Button asChild size="lg" className="magnetic-button">
                  <Link to="/signup">
                    Start for free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 animate-slide-up" style={{animationDelay: '0.6s'}}>
              <div className="relative rounded-xl overflow-hidden shadow-xl border border-primary/20 bg-white">
                <svg 
                  viewBox="0 0 800 500" 
                  className="w-full h-full"
                  style={{ background: 'linear-gradient(to bottom right, #f8f9fa, #ffffff)' }}
                >
                  {/* Dashboard Header */}
                  <rect x="40" y="30" width="720" height="60" rx="8" fill="#f5f5f7" />
                  <text x="60" y="65" fontSize="18" fontWeight="600" fill="#333">Agency Performance Dashboard</text>
                  
                  {/* KPI Cards */}
                  <rect x="40" y="110" width="170" height="100" rx="8" fill="#ec174c" />
                  <text x="60" y="140" fontSize="14" fontWeight="600" fill="#fff">Utilization Rate</text>
                  <text x="60" y="180" fontSize="28" fontWeight="700" fill="#fff">87%</text>
                  <circle cx="150" cy="160" r="25" fill="rgba(255,255,255,0.2)" />
                  <path d="M140,165 L150,155 L160,165" stroke="#fff" strokeWidth="2" fill="none" />

                  <rect x="230" y="110" width="170" height="100" rx="8" fill="#d10940" />
                  <text x="250" y="140" fontSize="14" fontWeight="600" fill="#fff">Productivity</text>
                  <text x="250" y="180" fontSize="28" fontWeight="700" fill="#fff">92%</text>
                  <circle cx="340" cy="160" r="25" fill="rgba(255,255,255,0.2)" />
                  <path d="M330,160 L340,150 L350,160 L360,150" stroke="#fff" strokeWidth="2" fill="none" />

                  <rect x="420" y="110" width="170" height="100" rx="8" fill="#3c6df0" />
                  <text x="440" y="140" fontSize="14" fontWeight="600" fill="#fff">Team Capacity</text>
                  <text x="440" y="180" fontSize="28" fontWeight="700" fill="#fff">76%</text>
                  <circle cx="530" cy="160" r="25" fill="rgba(255,255,255,0.2)" />
                  <path d="M520,170 L530,160 L540,170" stroke="#fff" strokeWidth="2" fill="none" />
                  
                  <rect x="610" y="110" width="150" height="100" rx="8" fill="#1f57e6" />
                  <text x="630" y="140" fontSize="14" fontWeight="600" fill="#fff">Revenue</text>
                  <text x="630" y="180" fontSize="28" fontWeight="700" fill="#fff">$143K</text>
                  <circle cx="710" cy="160" r="25" fill="rgba(255,255,255,0.2)" />
                  <path d="M700,170 L710,155 L720,163 L730,150" stroke="#fff" strokeWidth="2" fill="none" />

                  {/* Kanban Board */}
                  <rect x="40" y="230" width="720" height="240" rx="8" fill="#f5f5f7" />
                  <text x="60" y="260" fontSize="16" fontWeight="600" fill="#333">Project Kanban</text>
                  
                  {/* Kanban Columns */}
                  <rect x="60" y="280" width="160" height="170" rx="6" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
                  <rect x="60" y="280" width="160" height="30" rx="6" fill="#ffeef2" />
                  <text x="110" y="300" fontSize="14" fontWeight="600" fill="#333">To Do</text>
                  
                  <rect x="240" y="280" width="160" height="170" rx="6" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
                  <rect x="240" y="280" width="160" height="30" rx="6" fill="#ffb6c1" />
                  <text x="290" y="300" fontSize="14" fontWeight="600" fill="#333">In Progress</text>
                  
                  <rect x="420" y="280" width="160" height="170" rx="6" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
                  <rect x="420" y="280" width="160" height="30" rx="6" fill="#edf5ff" />
                  <text x="470" y="300" fontSize="14" fontWeight="600" fill="#333">Review</text>
                  
                  <rect x="600" y="280" width="160" height="170" rx="6" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
                  <rect x="600" y="280" width="160" height="30" rx="6" fill="#d5e8ff" />
                  <text x="650" y="300" fontSize="14" fontWeight="600" fill="#333">Completed</text>
                  
                  {/* Kanban Cards */}
                  {/* To Do Column Cards */}
                  <rect x="70" y="320" width="140" height="35" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="1" />
                  <text x="80" y="340" fontSize="12" fill="#555">Brand Strategy</text>
                  <rect x="180" y="330" width="20" height="6" rx="3" fill="#ec174c" />

                  <rect x="70" y="365" width="140" height="35" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="1" />
                  <text x="80" y="385" fontSize="12" fill="#555">Social Media Plan</text>
                  <rect x="180" y="375" width="20" height="6" rx="3" fill="#d10940" />
                  
                  {/* In Progress Column Cards */}
                  <rect x="250" y="320" width="140" height="35" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="1" />
                  <text x="260" y="340" fontSize="12" fill="#555">Website Redesign</text>
                  <rect x="360" y="330" width="20" height="6" rx="3" fill="#ec174c" />
                  
                  <rect x="250" y="365" width="140" height="35" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="1" />
                  <text x="260" y="385" fontSize="12" fill="#555">SEO Optimization</text>
                  <rect x="360" y="375" width="20" height="6" rx="3" fill="#3c6df0" />
                  
                  {/* Review Column Cards */}
                  <rect x="430" y="320" width="140" height="35" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="1" />
                  <text x="440" y="340" fontSize="12" fill="#555">Q4 Campaign</text>
                  <rect x="540" y="330" width="20" height="6" rx="3" fill="#1f57e6" />
                  
                  {/* Completed Column Cards */}
                  <rect x="610" y="320" width="140" height="35" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="1" />
                  <text x="620" y="340" fontSize="12" fill="#555">Brand Guidelines</text>
                  <rect x="720" y="330" width="20" height="6" rx="3" fill="#d5e8ff" />
                  
                  <rect x="610" y="365" width="140" height="35" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="1" />
                  <text x="620" y="385" fontSize="12" fill="#555">Content Strategy</text>
                  <rect x="720" y="375" width="20" height="6" rx="3" fill="#3c6df0" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="section-container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Everything you need to manage work</h2>
            <p className="text-muted-foreground text-lg">
              Powerful features designed to streamline your workflow and boost productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Time Tracking"
              description="Track time on projects with a simple click. Generate detailed reports for billing and productivity analysis."
            />
            <FeatureCard 
              icon={<LayoutGrid className="h-10 w-10 text-primary" />}
              title="Kanban Boards"
              description="Visualize workflows with customizable Kanban boards. Drag and drop tasks between columns."
            />
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Scheduling"
              description="Plan your team's workload with the interactive calendar. Set deadlines and milestones."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Analytics"
              description="Gain insights into team productivity and project progress with comprehensive analytics."
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Team Collaboration"
              description="Communicate effectively with integrated team chat and file sharing."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="h-10 w-10 text-primary" />}
              title="Dashboard View"
              description="Get a comprehensive overview of all your projects and tasks from one centralized dashboard."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="section-container text-center">
          <div className="max-w-3xl mx-auto px-6 py-12 rounded-xl bg-primary/10 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Ready to boost your productivity?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
              Join thousands of teams that use Magnetic to streamline their workflows.
            </p>
            <Button asChild size="lg" className="magnetic-button">
              <Link to="/signup">Start your free trial</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
