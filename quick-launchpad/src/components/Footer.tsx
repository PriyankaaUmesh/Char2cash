import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-6 w-6" />
            <span className="font-display text-lg font-bold">Char2Cash</span>
          </div>
          <p className="text-sm text-primary-foreground/70">
            Turning agricultural waste into climate wealth. Empowering farmers, enabling investors, saving the planet — Char2Cash.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Platform</h4>
          <div className="space-y-2 text-sm text-primary-foreground/70">
            <Link to="/impact" className="block hover:text-primary-foreground transition-colors">Impact Dashboard</Link>
            <Link to="/register?role=farmer" className="block hover:text-primary-foreground transition-colors">For Farmers</Link>
            <Link to="/register?role=investor" className="block hover:text-primary-foreground transition-colors">For Investors</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Resources</h4>
          <div className="space-y-2 text-sm text-primary-foreground/70">
            <Link to="/learn" className="block hover:text-primary-foreground transition-colors">Learn More</Link>
            <Link to="/about" className="block hover:text-primary-foreground transition-colors">About Us</Link>
            <Link to="/impact" className="block hover:text-primary-foreground transition-colors">Transparency Hub</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Contact</h4>
          <div className="space-y-2 text-sm text-primary-foreground/70">
            <p>support@char2cash.in</p>
            <p>+91 93533 03713</p>
            <p>Bengaluru, India</p>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/50">
        © 2026 Char2Cash. All rights reserved. Building a greener tomorrow.
      </div>
    </div>
  </footer>
);

export default Footer;
