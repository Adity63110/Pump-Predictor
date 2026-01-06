import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { MOCK_TOKENS } from "@/lib/mock-service";
import { VotingBar } from "@/components/voting-bar";
import { cn } from "@/lib/utils";

export default function Home() {
  const [ca, setCa] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ca.trim()) {
      // For prototype, just route to the first mock token if random string
      // In real app, this would route to /room/:ca
      const mockMatch = MOCK_TOKENS.find(t => t.ca.includes(ca) || t.symbol.includes(ca.toUpperCase()));
      if (mockMatch) {
        setLocation(`/room/${mockMatch.id}`);
      } else {
         // Fallback for demo
        setLocation(`/room/pepe-the-frog`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-w-green/30">
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-w-green/5 to-transparent pointer-events-none" />
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 font-display">
          <span className="text-w-green drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">W</span> 
          <span className="mx-2 text-muted-foreground text-4xl sm:text-6xl font-light italic">or</span> 
          <span className="text-trash-red drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]">TRASH</span>
          <span className="text-primary">?</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-12 font-light">
          The public verdict layer for Pump.fun. No fake certainty. <br className="hidden sm:block"/>
          Only raw crowd signals and on-chain data.
        </p>

        {/* Main Input */}
        <div className="w-full max-w-2xl relative z-10 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-w-green/20 via-primary/20 to-trash-red/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <form onSubmit={handleSearch} className="relative flex gap-2 bg-card p-2 rounded-lg border border-border ring-1 ring-white/10 shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                value={ca}
                onChange={(e) => setCa(e.target.value)}
                placeholder="Paste Contract Address (CA) or Token Name..." 
                className="pl-10 h-12 text-lg bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/50 font-mono"
              />
            </div>
            <Button size="lg" type="submit" className="h-12 px-8 font-bold text-base bg-primary text-primary-foreground hover:bg-white/90 transition-all">
              Verdict Room <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Trending Markets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-6 h-6 text-w-green" />
          <h2 className="text-2xl font-bold tracking-tight">Trending Rooms</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TOKENS.map((token) => (
            <Link key={token.id} href={`/room/${token.id}`}>
              <div className="group relative bg-card/50 hover:bg-card border border-border hover:border-border/80 transition-all rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-primary/5 p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {token.imageUrl ? (
                        <img src={token.imageUrl} alt={token.name} className="w-10 h-10 rounded-full" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                            {token.symbol[0]}
                        </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">{token.name}</h3>
                      <span className="text-xs font-mono text-muted-foreground">${token.symbol}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-xs font-bold px-2 py-1 rounded bg-secondary/50", 
                        token.rugScale < 30 ? "text-w-green" : token.rugScale > 70 ? "text-trash-red" : "text-yellow-500"
                    )}>
                        Rug Score: {token.rugScale}
                    </div>
                  </div>
                </div>

                <VotingBar wVotes={token.votes.w} trashVotes={token.votes.trash} size="sm" />
                
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Dev: {token.devWalletPct}%
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span>MC: ${(token.marketCap / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
