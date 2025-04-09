import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!showVerification) {
        // Initial sign up - Try a more compatible approach with the Clerk API
        const result = await signUp.create({
          emailAddress: email,
          password,
        });

        // Set name separately to avoid parameter issues
        if (firstName) {
          await signUp.update({
            firstName,
          });
        }
        
        if (lastName) {
          await signUp.update({
            lastName,
          });
        }

        // If there are missing fields or CAPTCHA requirement, it will throw an error above
        // Start email verification
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setShowVerification(true);
        toast({
          title: "Verification needed",
          description: "We've sent a verification code to your email address."
        });
      } else {
        // Complete verification
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: verificationCode,
        });

        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId });
          navigate("/dashboard");
          toast({
            title: "Account created",
            description: "Welcome to Neema!",
          });
        }
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      
      // Handle specific error cases
      if (err.errors && err.errors.length > 0) {
        const error = err.errors[0];
        
        if (error.code === "form_identifier_exists") {
          toast({
            title: "Email already exists",
            description: "This email is already registered. Please use another email or try logging in.",
            variant: "destructive",
          });
        } else if (error.code === "form_param_missing") {
          toast({
            title: "Missing information",
            description: error.message || "Please fill in all required fields",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Something went wrong",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We've sent a verification code to {email}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input
            id="verificationCode"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full neema-button" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify email & sign up"}
        </Button>
      </form>
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
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {/* Clerk CAPTCHA container */}
      <div id="clerk-captcha" className="mt-4"></div>
      
      <Button type="submit" className="w-full neema-button" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}; 