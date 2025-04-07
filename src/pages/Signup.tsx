
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Check } from "lucide-react";
import { ShapesBlob, ShapesCircle, ShapesDots, ShapesTriangle } from "@/components/ui/shapes";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created",
        description: "You've successfully created your account. Redirecting to dashboard...",
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-magnetic-50 to-white p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <ShapesBlob 
        color="pastel-peach" 
        size="lg" 
        className="left-[10%] top-[10%]" 
      />
      <ShapesBlob 
        color="pastel-mint" 
        size="md" 
        className="right-[15%] bottom-[20%]" 
      />
      <ShapesCircle 
        color="pastel-lavender" 
        variant="outline"
        size="sm" 
        className="right-[25%] top-[30%] animate-float" 
      />
      <ShapesTriangle 
        color="rgba(255,222,226,0.4)" 
        size="sm" 
        className="left-[40%] bottom-[30%] animate-float" 
        style={{ animationDelay: '1.5s' }}
      />
      <ShapesDots 
        dotColor="rgba(255,182,193,0.15)" 
        size={12} 
        spacing={60} 
      />
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-pastel-pink/30 p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-md bg-magnetic-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">Magnetic</span>
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pastel-blush to-pastel-pink">Create your account</h1>
            <p className="text-muted-foreground mt-1">Start your free 14-day trial</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters long
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="bg-pastel-pink/20 rounded-full p-1 mt-0.5">
                  <Check className="h-3 w-3 text-magnetic-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No credit card required
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-pastel-pink/20 rounded-full p-1 mt-0.5">
                  <Check className="h-3 w-3 text-magnetic-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Full access to all features for 14 days
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-pastel-pink/20 rounded-full p-1 mt-0.5">
                  <Check className="h-3 w-3 text-magnetic-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Cancel anytime
                </p>
              </div>
            </div>
            
            <Button type="submit" className="w-full magnetic-button" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-magnetic-600 hover:text-magnetic-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
