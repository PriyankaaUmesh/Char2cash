import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Impact", href: "/impact" },
  { label: "Farmers", href: "/signin?role=farmer" },
  { label: "Investors", href: "/signin?role=investor" },
  { label: "Learn More", href: "/learn" },
  { label: "About Us", href: "/about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">Char2<span className="text-accent">Cash</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
