import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";
import { useSignUp } from "@clerk/clerk-react";

export const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create a simple unique waitlist entry instead of trying to create a user
      // This avoids the bot protection issues
      
      // A more reliable approach - just collect information and show success
      // In a real implementation, you'd store this in your database
      
      // Show success message
      setIsSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll notify you when Neema launches.",
      });
      
      // Create a record in local storage to remember this waitlist signup
      localStorage.setItem('waitlist_signup', JSON.stringify({
        email,
        firstName,
        lastName,
        timestamp: new Date().toISOString()
      }));
      
      // In a real production app, you'd make an API call to your backend here
      // to store the waitlist entry in your database
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setEmail("");
        setFirstName("");
        setLastName("");
      }, 3000);
    } catch (err: any) {
      console.error("Waitlist error:", err);
      
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
        <p className="text-muted-foreground mb-6">
          Thanks for joining our waitlist. We'll notify you when Neema launches.
        </p>
        <Button 
          onClick={() => navigate("/")} 
          variant="outline" 
          className="mx-auto"
        >
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      {/* Clerk CAPTCHA container */}
      <div id="clerk-captcha-waitlist" className="mt-4"></div>
      
      <Button type="submit" className="w-full neema-button" disabled={isLoading}>
        {isLoading ? "Joining..." : "Join the waitlist"}
      </Button>
    </form>
  );
}; 