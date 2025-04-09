
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import PageTitle from "@/components/shared/PageTitle";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen bg-neema-background flex flex-col">
      <PageTitle title="Log in to Neema" />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="h-10 w-10 rounded-xl overflow-hidden">
                <img 
                  src="/lovable-uploads/52340e59-2c7c-4b31-a8fd-e4d2bb5a7758.png" 
                  alt="Neema Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Log in to your Neema account</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-neema-secondary/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-neema-secondary/30 focus-visible:ring-neema-primary"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-neema-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-neema-secondary/30 focus-visible:ring-neema-primary"
                />
              </div>
              
              <Button type="submit" className="neema-button w-full mt-6">
                Log in
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-neema-accent hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
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
