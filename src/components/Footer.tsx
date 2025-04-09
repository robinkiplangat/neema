
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl overflow-hidden">
                <img 
                  src="/lovable-uploads/52340e59-2c7c-4b31-a8fd-e4d2bb5a7758.png" 
                  alt="Neema Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">Neema</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-xs">
              Your friendly AI co-pilot for solo founders, creators, and moonlighters. Track progress, manage tasks, and stay in flow — effortlessly.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-3">
              <li><Link to="/features/task-management" className="text-muted-foreground hover:text-foreground transition-colors">Task & Project Management</Link></li>
              <li><Link to="/features/smart-notes" className="text-muted-foreground hover:text-foreground transition-colors">Smart Notes</Link></li>
              <li><Link to="/features/communication" className="text-muted-foreground hover:text-foreground transition-colors">Communication Management</Link></li>
              <li><Link to="/features/social-media" className="text-muted-foreground hover:text-foreground transition-colors">Social Media Assistant</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/guides" className="text-muted-foreground hover:text-foreground transition-colors">Guides</Link></li>
              <li><Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/api" className="text-muted-foreground hover:text-foreground transition-colors">API</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/legal" className="text-muted-foreground hover:text-foreground transition-colors">Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Neema. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
