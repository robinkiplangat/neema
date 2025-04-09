import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import PageTitle from "@/components/shared/PageTitle";
import { Waitlist, SignedIn } from "@clerk/clerk-react";

const JoinWaitlist = () => {
  return (
    <div className="min-h-screen bg-neema-background flex flex-col">
      <PageTitle title="Join the Neema Waitlist" />
      
      {/* Redirect if already logged in */}
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="h-10 w-10 rounded-xl overflow-hidden">
                <img 
                  src="/images/neema_icon.png" 
                  alt="Neema Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-neema-primary" />
              <h1 className="text-2xl md:text-3xl font-bold">Join the waitlist</h1>
            </div>
            <p className="text-muted-foreground mt-2">Be among the first to experience Neema when we launch</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-neema-secondary/20">
            <Waitlist signInUrl="/login" />
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinWaitlist; 