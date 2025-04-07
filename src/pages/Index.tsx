
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
              <div className="relative rounded-xl overflow-hidden shadow-md border border-border/40 bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1024" 
                  alt="Magnetic Dashboard Preview" 
                  className="rounded-xl w-full"
                />
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
          <div className="max-w-3xl mx-auto px-6 py-12 rounded-xl bg-primary bg-opacity-5 border border-primary/10">
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
