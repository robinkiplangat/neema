
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-background/90 backdrop-blur-md z-50 border-b">
      <div className="section-container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-magnetic-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold">Magnetic</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/features" className="text-foreground/80 hover:text-foreground transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/resources" className="text-foreground/80 hover:text-foreground transition-colors">
            Resources
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="magnetic-button" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="section-container py-4 flex flex-col gap-4">
            <Link 
              to="/features" 
              className="py-2 text-foreground/80 hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="py-2 text-foreground/80 hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/resources" 
              className="py-2 text-foreground/80 hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <div className="flex flex-col gap-3 pt-2">
              <Button variant="outline" asChild className="w-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button className="magnetic-button w-full" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
