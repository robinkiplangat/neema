
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import PageTitle from "@/components/shared/PageTitle";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log({ name, email, password, agreeTerms });
  };

  return (
    <div className="min-h-screen bg-neema-background flex flex-col">
      <PageTitle title="Sign up for Neema" />
      
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
            <h1 className="text-2xl md:text-3xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-2">Start your productivity journey with Neema</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-neema-secondary/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-neema-secondary/30 focus-visible:ring-neema-primary"
                />
              </div>
              
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-neema-secondary/30 focus-visible:ring-neema-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long with a number and a special character.
                </p>
              </div>
              
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} 
                  className="mt-1 data-[state=checked]:bg-neema-primary data-[state=checked]:border-neema-primary"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-neema-accent hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-neema-accent hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="neema-button w-full mt-6"
                disabled={!agreeTerms}
              >
                Create account
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-neema-accent hover:underline font-medium">
                    Log in
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

export default Signup;
