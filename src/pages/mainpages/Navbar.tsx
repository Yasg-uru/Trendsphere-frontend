import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Moon, Sun, Menu, X, Search, ShoppingCart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const navigate=useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const navItems = [
    { name: "Men", href: "#" },
    { name: "Women", href: "#" },
    { name: "Kids", href: "#" },
    { name: "Accessories", href: "#" },
    { name: "Sale", href: "#" },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">
                Trendsphere
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-64"
              />
            </div>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping cart</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
                variant="outline"
                size="sm"
                className={`font-semibold transition-colors duration-200 dark:text-black dark:bg-white text-white bg-black`}
                onClick={() => {
                  navigate("/sign-in")
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
          </div>
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-muted">
            <div className="flex items-center px-5">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-full"
                />
              </div>
              <Button variant="ghost" size="icon" className="ml-4">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping cart</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="ml-4"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`font-semibold transition-colors duration-200 `}
                onClick={() => {
                  navigate("/sign-in")
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
