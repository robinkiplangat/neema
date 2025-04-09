import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Notebook, Mail, Calendar, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

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
                <span>Meet </span>
                <span className="text-neema-primary">Neema</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md animate-slide-up mt-4" style={{animationDelay: '0.2s'}}>
                Your friendly AI co-pilot for <span className="font-semibold">solo founders, creators, and moonlighters.</span>
              </p>
              {/* <p className="text-lg md:text-xl text-neema-text max-w-md animate-slide-up" style={{animationDelay: '0.4s'}}>
                Track progress, manage tasks, and stay in flow — effortlessly.
              </p> */}
              <p className="text-gray-600 max-w-md animate-slide-up" style={{animationDelay: '0.6s'}}>
                Neema brings together your notes, emails, calendar, and socials into one seamless workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{animationDelay: '0.8s'}}>
                <SignedOut>
                  <Button asChild size="lg" className="neema-button">
                    <Link to="/signup">
                      Start for free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-neema-secondary text-neema-text hover:bg-neema-secondary/10">
                    <Link to="/login">
                      Log in
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost" className="text-neema-text hover:bg-neema-secondary/10">
                    <Link to="/joinwaitlist">
                      Join waitlist
                    </Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button asChild size="lg" className="neema-button">
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </SignedIn>
              </div>
              <div className="flex flex-col gap-3 animate-slide-up" style={{animationDelay: '1s'}}>
                <p className="text-sm text-muted-foreground">Integrated with your favorite tools:</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle className="h-4 w-4 text-neema-primary" />
                    <span>Notion</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle className="h-4 w-4 text-neema-primary" />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle className="h-4 w-4 text-neema-primary" />
                    <span>Calendar</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle className="h-4 w-4 text-neema-primary" />
                    <span>LinkedIn</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md animate-float">
                <img 
                  src="/images/neema_mascot.png" 
                  alt="Neema Logo" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-neema-primary rounded-full opacity-20 blur-xl z-0 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-neema-accent rounded-full opacity-20 blur-xl z-0 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All Your Work in One Place</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Neema connects your productivity tools to help you focus on what matters most.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Notebook className="h-8 w-8 text-neema-primary" />} 
              title="Task & Project Management" 
              description="Organize tasks across multiple projects with smart deadlines and reminders based on your calendar context."
            />
            <FeatureCard 
              icon={<Mail className="h-8 w-8 text-neema-primary" />} 
              title="Smart Notes" 
              description="Bi-directional sync with Notion, plus AI-powered summarization, tagging, and linking of notes."
            />
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-neema-primary" />} 
              title="Communication Management" 
              description="Gmail integration for email triage and smart replies, plus scheduling assistance via Google Calendar."
            />
            <FeatureCard 
              icon={<Linkedin className="h-8 w-8 text-neema-primary" />} 
              title="Social Media Assistant" 
              description="Draft, schedule, and optimize LinkedIn posts with engagement metrics and suggestions."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-neema-background">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Neema Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your personal AI assistant that keeps everything organized and helps you stay productive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="neema-card p-6">
              <div className="w-12 h-12 rounded-full bg-neema-secondary flex items-center justify-center mb-4">
                <span className="text-neema-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Tools</h3>
              <p className="text-muted-foreground">
                Seamlessly integrate with Notion, Gmail, Google Calendar, and LinkedIn with just a few clicks.
              </p>
            </div>
            
            <div className="neema-card p-6">
              <div className="w-12 h-12 rounded-full bg-neema-secondary flex items-center justify-center mb-4">
                <span className="text-neema-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize Your Workflow</h3>
              <p className="text-muted-foreground">
                Set your preferences for daily check-ins, notifications, and how Neema should prioritize your tasks.
              </p>
            </div>
            
            <div className="neema-card p-6">
              <div className="w-12 h-12 rounded-full bg-neema-secondary flex items-center justify-center mb-4">
                <span className="text-neema-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Let Neema Do the Rest</h3>
              <p className="text-muted-foreground">
                Enjoy a daily summary of tasks, important emails, meetings, and smart suggestions to keep you productive.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-neema-primary">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Boost Your Productivity?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of solo founders, creators, and moonlighters who use Neema to stay on top of their work and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Button asChild size="lg" className="bg-white text-neema-primary hover:bg-white/90">
                <Link to="/signup">
                  Start for free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/demo">
                  See Neema in action
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
                <Link to="/joinwaitlist">
                  Join waitlist
                </Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button asChild size="lg" className="bg-white text-neema-primary hover:bg-white/90">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
