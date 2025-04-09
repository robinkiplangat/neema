
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageTitle from "@/components/shared/PageTitle";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neema-background flex flex-col items-center justify-center px-4 py-12">
      <PageTitle title="Page Not Found | Neema" />
      
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-xl overflow-hidden">
            <img 
              src="/lovable-uploads/52340e59-2c7c-4b31-a8fd-e4d2bb5a7758.png" 
              alt="Neema Logo" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild className="neema-button">
          <Link to="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
