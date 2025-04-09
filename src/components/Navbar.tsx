
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed w-full bg-neema-background/95 backdrop-blur-md z-50 border-b border-neema-secondary/30">
      <div className="section-container py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl overflow-hidden">
            <img 
              src="/lovable-uploads/52340e59-2c7c-4b31-a8fd-e4d2bb5a7758.png" 
              alt="Neema Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xl font-bold text-neema-text">Neema</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-foreground/80 hover:text-foreground transition-colors">
                Features 
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/features/task-management">Task Management</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/features/smart-notes">Smart Notes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/features/communication">Communication</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/features/social-media">Social Media</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            to="/pricing" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link 
            to="/resources" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Resources
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-foreground/80 hover:text-foreground transition-colors`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="border-neema-secondary text-neema-text hover:bg-neema-secondary/10" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button className="neema-button" asChild>
            <Link to="/signup">Start for free</Link>
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
        <div className="md:hidden bg-neema-background border-b">
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
            <Link 
              to="/dashboard" 
              className="py-2 text-foreground/80 hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="flex flex-col gap-3 pt-2">
              <Button variant="outline" className="border-neema-secondary text-neema-text hover:bg-neema-secondary/10 w-full" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button className="neema-button w-full" asChild>
                <Link to="/signup">Start for free</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
