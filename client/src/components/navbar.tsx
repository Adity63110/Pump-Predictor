import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { TrendingUp, Home, BrainCircuit } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/markets", label: "Markets", icon: TrendingUp },
    { href: "/ai-analyser", label: "AI Analyser", icon: BrainCircuit },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <span className="flex items-center space-x-2 cursor-pointer">
              <span className="text-xl font-bold tracking-tight text-primary">PumpVote</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                    location === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" data-testid="button-sign-in">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}
