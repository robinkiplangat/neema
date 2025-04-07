
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar, BarChart3, Users, Trophy, LayoutGrid } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
                <span className="text-magnetic-600">Track time,</span> <br/>
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
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1024" 
                alt="Magnetic Dashboard Preview" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-magnetic-50">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage work</h2>
            <p className="text-muted-foreground text-lg">
              Powerful features designed to streamline your workflow and boost productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Clock className="h-10 w-10 text-magnetic-600" />}
              title="Time Tracking"
              description="Track time on projects with a simple click. Generate detailed reports for billing and productivity analysis."
            />
            <FeatureCard 
              icon={<LayoutGrid className="h-10 w-10 text-magnetic-600" />}
              title="Kanban Boards"
              description="Visualize workflows with customizable Kanban boards. Drag and drop tasks between columns."
            />
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-magnetic-600" />}
              title="Scheduling"
              description="Plan your team's workload with the interactive calendar. Set deadlines and milestones."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-magnetic-600" />}
              title="Analytics"
              description="Gain insights into team productivity and project progress with comprehensive analytics."
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-magnetic-600" />}
              title="Team Collaboration"
              description="Communicate effectively with integrated team chat and file sharing."
            />
            <FeatureCard 
              icon={<Trophy className="h-10 w-10 text-magnetic-600" />}
              title="Goal Tracking"
              description="Set and monitor team and individual goals with visual progress indicators."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 magnetic-gradient text-white">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-white/80">
            Join thousands of teams that use Magnetic to streamline their workflows.
          </p>
          <Button asChild size="lg" variant="secondary" className="font-medium">
            <Link to="/signup">Start your free trial</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
