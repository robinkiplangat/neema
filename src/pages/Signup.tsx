import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageTitle from "@/components/shared/PageTitle";
import { SignedIn } from "@clerk/clerk-react";
import { SignUpForm } from "@/components/authPages/SignUpForm";

const Signup = () => {
  return (
    <div className="min-h-screen bg-neema-background flex flex-col">
      <PageTitle title="Sign up for Neema" />
      
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
            <h1 className="text-2xl md:text-3xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-2">Start your productivity journey with Neema</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-neema-secondary/20">
            <SignUpForm />
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

export default Signup;
