import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import PageTitle from "@/components/shared/PageTitle";
import { SignedIn } from "@clerk/clerk-react";
import { SignInForm } from "@/components/authPages/SignInForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-neema-background flex flex-col">
      <PageTitle title="Log in to Neema" />
      
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
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Log in to your Neema account</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-neema-secondary/20">
            <SignInForm />
            
            <div className="mt-6 pt-6 border-t border-neema-secondary/20 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-neema-primary" />
                <p className="text-sm font-medium">Don't have an account yet?</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                We're not onboarding new users right now, but you can join our waitlist to be first in line when we launch!
              </p>
              <Link to="/joinwaitlist">
                <button className="text-sm text-neema-primary hover:underline font-medium">
                  Join the waitlist →
                </button>
              </Link>
            </div>
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

export default Login;
