import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { TrendingUp, AlertTriangle, Activity, BrainCircuit, ShieldCheck, Zap, Plus } from "lucide-react";
import { VotingBar } from "@/components/voting-bar";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PumpList() {
  const [newCa, setNewCa] = useState("");
  const { toast } = useToast();
  const { data: tokens, isLoading } = useQuery<any[]>({
    queryKey: ["/api/pumplist"],
  });

  const addTokenMutation = useMutation({
    mutationFn: async (ca: string) => {
      const res = await apiRequest("POST", "/api/trending/tokens", { ca });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pumplist"] });
      setNewCa("");
      toast({ title: "Success", description: "Token added to trending list" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add token", 
        variant: "destructive" 
      });
    }
  });

  return (
    <div className="bg-background text-foreground font-sans selection:bg-w-green/30 pb-20">
      {/* Hero Section */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-in fade-in duration-1000">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Curated Trending Tokens</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 uppercase">
          🔥 Trending Tokens
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mb-8 font-medium italic">
          Selected manually, analyzed on-chain in real-time.
        </p>

        <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-xs text-yellow-500/80 font-mono uppercase tracking-widest flex items-center gap-3">
          <Activity className="w-4 h-4" />
          All momentum and risk data is algorithmic based on raw on-chain signals.
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl bg-card/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens?.map((token) => (
              <Link key={token.ca} href={`/room/${token.id}`}>
                <div className="group relative bg-card/50 hover:bg-card border border-border hover:border-border/80 transition-all rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-primary/5 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden flex items-center justify-center font-bold text-muted-foreground ring-1 ring-border">
                        {token.imageUrl ? (
                          <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover" />
                        ) : (
                          token.symbol[0]
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">{token.name}</h3>
                        <span className="text-xs font-mono text-muted-foreground">${token.symbol}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded", 
                        token.riskLevel === 'Low' ? "bg-w-green/20 text-w-green" : token.riskLevel === 'High' ? "bg-trash-red/20 text-trash-red" : "bg-yellow-500/20 text-yellow-500"
                      )}>
                        {token.riskLevel} Risk
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">Rug: {token.rugScore}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Bonding Progress</span>
                      <span className="text-primary">{token.bondingProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${token.bondingProgress}%` }}
                      />
                    </div>
                  </div>

                  <VotingBar wVotes={token.wVotes} trashVotes={token.trashVotes} size="sm" />
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Dev: {token.devWalletPct}%
                      </span>
                      <span>MC: ${(token.marketCap / 1000).toFixed(0)}k</span>
                      <span>Vol: ${(token.volume24h / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase">
                       Audit <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
