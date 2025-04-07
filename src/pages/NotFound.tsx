
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShapesBlob, ShapesCircle, ShapesDots } from "@/components/ui/shapes";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-magnetic-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <ShapesBlob 
        color="pastel-lavender" 
        size="lg" 
        className="left-[10%] top-[20%]" 
      />
      <ShapesBlob 
        color="pastel-peach" 
        size="md" 
        className="right-[15%] bottom-[30%]" 
      />
      <ShapesCircle 
        color="pastel-mint" 
        variant="outline"
        size="md" 
        className="left-[20%] bottom-[20%] animate-float" 
      />
      <ShapesDots 
        dotColor="rgba(255,182,193,0.15)" 
        size={12} 
        spacing={60} 
      />
      
      <div className="text-center z-10 p-8 bg-white rounded-xl shadow-lg border border-pastel-pink/30 max-w-md">
        <h1 className="text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pastel-blush to-pastel-pink">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <Button asChild className="magnetic-button">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
