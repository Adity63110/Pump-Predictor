import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { TrendingUp, Home, BrainCircuit, FileText } from "lucide-react";
import logoPng from "@assets/ChatGPT_Image_Jan_7,_2026,_06_42_47_PM_1767791577817.png";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/pumplist", label: "Trending", icon: TrendingUp },
    { href: "/ai-analyser", label: "AI Analyzer", icon: BrainCircuit },
    { href: "/docs", label: "Docs", icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center">
        {/* Logo - Left */}
        <div className="flex-1">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer w-fit">
              <img src={logoPng} alt="VerdictX Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold tracking-tight text-[#54d292]">VerdictX</span>
            </div>
          </Link>
        </div>

        {/* Tabs - Center */}
        <div className="hidden md:flex items-center justify-center gap-10 flex-1 px-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`relative flex items-center gap-2 text-sm font-bold transition-all hover:text-[#54d292] hover:drop-shadow-[0_0_8px_rgba(84,210,146,0.5)] cursor-pointer group whitespace-nowrap ${
                  location === item.href ? "text-[#54d292]" : "text-zinc-400"
                }`}
                data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                <span className={`absolute -bottom-[22px] left-0 w-0 h-0.5 bg-[#54d292] transition-all duration-300 group-hover:w-full ${location === item.href ? "w-full" : ""}`} />
              </span>
            </Link>
          ))}
        </div>

        {/* Actions - Right */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#54d292] text-[#54d292] hover:bg-[#54d292]/10 hover:text-[#54d292] font-bold"
              data-testid="button-sign-in"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
