import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, AlertTriangle, ArrowRight, Activity, ShieldCheck, Zap, CheckCircle2, BrainCircuit, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { VotingBar } from "@/components/voting-bar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollReveal } from "@/components/scroll-reveal";

function AIAnalysisColumn() {
  const [step, setStep] = useState(0);
  const factors = [
    "Dev wallet exposure",
    "Insider concentration",
    "Holder distribution",
    "Bonding progress",
    "Volume authenticity",
    "Liquidity risk"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % (factors.length + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [factors.length]);

  return (
    <div className="w-full lg:w-80 shrink-0">
      <ScrollReveal delay={0.4}>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-[#54d292]/20 to-transparent rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-5 shadow-2xl overflow-hidden">
            {/* Scan Line Animation */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#54d292]/50 to-transparent top-0 animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-md bg-[#54d292]/10">
                <BrainCircuit className="w-4 h-4 text-[#54d292]" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#54d292]/80">AI Real-time Scan</h3>
            </div>

            <div className="space-y-4 mb-8">
              {factors.map((factor, idx) => (
                <div 
                  key={factor} 
                  className={cn(
                    "flex items-center gap-3 transition-all duration-500",
                    idx < step ? "opacity-100 translate-x-0" : "opacity-30 -translate-x-1"
                  )}
                >
                  {idx < step ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#54d292]" />
                  ) : (idx === step ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#54d292] animate-spin" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                  ))}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">{factor}</span>
                </div>
              ))}
            </div>

            <div className="space-y-5 pt-5 border-t border-zinc-800/50">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter text-zinc-500">
                  <span>Rug Score Meter</span>
                  <span className="text-[#54d292] animate-pulse">Waiting...</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-[#54d292]/20 to-[#54d292]/40 rounded-full animate-[pulse_2s_infinite]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter text-zinc-500">
                  <span>Bonding Progress</span>
                  <span>--%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-[#54d292] rounded-full transition-all duration-1000" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Verdict Status</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-zinc-800 text-zinc-400 italic">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function Home() {
  const [ca, setCa] = useState("");
  const [, setLocation] = useLocation();

  const { data: trendingTokens, isLoading } = useQuery<any[]>({
    queryKey: ["/api/pumplist"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ca.trim()) {
      const match = trendingTokens?.find(t => t.ca.toLowerCase() === ca.toLowerCase() || t.symbol.toLowerCase() === ca.toLowerCase());
      if (match) {
        setLocation(`/room/${match.id}`);
      } else {
        setLocation(`/room/${ca}`);
      }
    }
  };

  return (
    <div className="bg-black text-white font-sans selection:bg-[#54d292]/30">
      
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#54d292]/10 to-transparent pointer-events-none" />
        
        <ScrollReveal>
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter mb-6 uppercase">
            <span className="text-[#54d292] drop-shadow-[0_0_20px_rgba(84,210,146,0.4)]">W</span> 
            <span className="mx-2 text-zinc-500 text-4xl sm:text-6xl font-light italic lowercase">or</span> 
            <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">TRASH</span>
            <span className="text-[#54d292]">?</span>
          </h1>
        </ScrollReveal>
        
        <ScrollReveal delay={0.1}>
          <p className="text-xl text-zinc-400 max-w-2xl mb-12 font-medium italic">
            The public verdict layer for Pump.fun. <br className="hidden sm:block"/>
            No fake certainty. Only raw crowd signals.
          </p>
        </ScrollReveal>

        {/* Main Search and AI Column */}
        <div className="w-full flex flex-col lg:flex-row gap-8 items-start mb-16 relative z-10">
          <div className="flex-1 w-full space-y-12">
            <ScrollReveal delay={0.2}>
              <div className="w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#54d292]/30 via-[#54d292]/10 to-red-500/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <form onSubmit={handleSearch} className="relative flex gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 shadow-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <Input 
                      value={ca}
                      onChange={(e) => setCa(e.target.value)}
                      placeholder="Paste Contract Address (CA)..." 
                      className="pl-12 h-14 text-lg bg-transparent border-none focus-visible:ring-0 placeholder:text-zinc-600 font-mono font-bold"
                    />
                  </div>
                  <Button size="lg" type="submit" className="h-14 px-6 sm:px-10 font-black text-lg bg-[#54d292] text-black hover:bg-white transition-all rounded-lg uppercase">
                    Analyze <ArrowRight className="ml-2 w-5 h-5 hidden sm:inline" />
                  </Button>
                </form>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <div className="text-left hidden lg:block">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#54d292] animate-ping" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-[#54d292]">System Status: Online</span>
                </div>
                <p className="text-zinc-500 font-mono text-sm max-w-lg">
                  VerdictX Engine is actively scanning Pump.fun mempool for high-signal launches. Real-time crowd sentiment is being aggregated every millisecond.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Home Trending Grid */}
        <div className="w-full max-w-7xl">
          <ScrollReveal delay={0.3}>
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-[#54d292] animate-pulse" />
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Top Trending</h2>
              </div>
              <Link href="/pumplist">
                <Button variant="ghost" className="text-zinc-400 hover:text-[#54d292] font-bold uppercase tracking-widest text-xs">
                  View All Markets <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl bg-zinc-900/50" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingTokens?.slice(0, 6).map((token, idx) => (
                <ScrollReveal key={token.ca} delay={0.1 * (idx % 3)} duration={0.4}>
                  <Link href={`/room/${token.id}`}>
                    <div className="group relative bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/50 hover:border-[#54d292]/30 transition-all rounded-xl overflow-hidden cursor-pointer p-6 space-y-4 hover:shadow-2xl hover:shadow-[#54d292]/5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden flex items-center justify-center font-bold text-zinc-500 ring-1 ring-zinc-700">
                            {token.imageUrl ? (
                              <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover" />
                            ) : (
                              token.symbol[0]
                            )}
                          </div>
                          <div className="text-left">
                            <h3 className="font-black text-lg leading-none group-hover:text-[#54d292] transition-colors uppercase tracking-tight">{token.name}</h3>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">${token.symbol}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <div className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded", 
                            token.riskLevel === 'Low' ? "bg-[#54d292]/20 text-[#54d292]" : token.riskLevel === 'High' ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"
                          )}>
                            {token.riskLevel} Risk
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">Rug: {token.rugScore}</div>
                        </div>
                      </div>

                      <VotingBar wVotes={token.wVotes} trashVotes={token.trashVotes} size="sm" />
                      
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-red-500/50" />
                            Dev: {token.devWalletPct}%
                          </span>
                          <span>MC: ${(token.marketCap / 1000).toFixed(0)}k</span>
                          <span>Vol: ${(token.volume24h / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-[#54d292] uppercase">
                           Audit <ShieldCheck className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
