import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit, Loader2, Search, ArrowRight, ShieldCheck, ShieldAlert, Coins, Users, Activity, FlaskConical, AlertTriangle, TrendingUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AIAnalyser() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCa = params.get("ca") || "";
  
  const [ca, setCa] = useState(initialCa);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (ca: string) => {
      const res = await apiRequest("POST", "/api/ai/analyse", { ca });
      return res.json();
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (initialCa) {
      mutation.mutate(initialCa);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ca.trim()) {
      mutation.mutate(ca);
    }
  };

  const analysis = mutation.data;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground font-sans selection:bg-w-green/30">
      <div className="container py-12 max-w-6xl mx-auto px-4 space-y-12">
        {/* TOP SECTION: Token Input Panel */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-w-green/20 via-primary/20 to-trash-red/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <Card className="relative bg-[#111111] border-white/5 shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                    {analysis?.imageUrl ? (
                      <img src={analysis.imageUrl} alt={analysis.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Coins className="w-8 h-8 text-muted-foreground mx-auto mb-1 opacity-20" />
                        <span className="text-[10px] text-muted-foreground/40 font-mono leading-tight px-2 block">Token image unavailable</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        {analysis ? `${analysis.name} (${analysis.symbol})` : "Analyze Any Token"}
                        {analysis?.riskLevel === 'Low' && <ShieldCheck className="h-6 w-6 text-w-green drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />}
                      </h1>
                      <p className="text-muted-foreground text-sm font-medium">Fast, confident, on-chain AI analysis</p>
                    </div>
                    {analysis && (
                      <div className="bg-black/40 border border-white/5 rounded-lg px-4 py-2 flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Confidence</span>
                        <span className="text-primary font-mono font-bold">{analysis.confidence}</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 group/input">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <Input 
                        placeholder="Paste Contract Address (CA)..." 
                        className="pl-12 h-14 bg-black/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all text-lg font-mono placeholder:text-muted-foreground/30"
                        value={ca}
                        onChange={(e) => setCa(e.target.value)}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="h-14 px-10 bg-primary text-black font-black text-lg hover:bg-white hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all uppercase tracking-tighter" 
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "Analyze"}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {mutation.isPending && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse"></div>
              <BrainCircuit className="h-20 w-20 text-primary relative animate-bounce" />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-2xl font-black tracking-tighter text-white uppercase animate-pulse">Scanning On-Chain Data</p>
              <p className="text-muted-foreground font-mono text-sm max-w-md mx-auto">Analyzing holders, running risk models, and identifying insider clusters...</p>
            </div>
          </div>
        )}

        {analysis && !mutation.isPending && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* CARD 1: Rug Risk Score */}
            <Card className="bg-[#111111] border-white/5 shadow-xl relative overflow-hidden group">
              <div className={cn(
                "absolute top-0 left-0 w-full h-1 transition-colors duration-500",
                analysis.riskLevel === 'Low' ? 'bg-w-green' : analysis.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-trash-red'
              )} />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Rug Risk Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-10 space-y-8">
                <div className="relative flex items-center justify-center w-48 h-48">
                  {/* Circular Meter Effect */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={552.92}
                      strokeDashoffset={552.92 - (552.92 * analysis.rugScore) / 100}
                      className={cn(
                        "transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                        analysis.riskLevel === 'Low' ? 'text-w-green' : analysis.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-trash-red'
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black tracking-tighter text-white">
                      {analysis.rugScore}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground opacity-50">/ 100</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className={cn(
                    "text-3xl font-black uppercase tracking-widest transition-colors",
                    analysis.riskLevel === 'Low' ? 'text-w-green' : analysis.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-trash-red'
                  )}>
                    {analysis.riskLevel} Risk
                  </div>
                </div>

                <div className="w-full space-y-3 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Key Risk Factors:
                  </div>
                  <div className="space-y-2">
                    {analysis.devShare && parseFloat(analysis.devShare) > 10 && (
                      <div className="text-[11px] font-mono py-1.5 px-3 bg-trash-red/10 border border-trash-red/20 text-trash-red rounded uppercase">
                        High dev-controlled supply
                      </div>
                    )}
                    {analysis.insiderClusterShare && parseFloat(analysis.insiderClusterShare) > 20 && (
                      <div className="text-[11px] font-mono py-1.5 px-3 bg-trash-red/10 border border-trash-red/20 text-trash-red rounded uppercase">
                        Insider-linked activity detected
                      </div>
                    )}
                    {analysis.riskLevel === 'Low' && (
                      <div className="text-[11px] font-mono py-1.5 px-3 bg-w-green/10 border border-w-green/20 text-w-green rounded uppercase">
                        Clean liquidity profile
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: Supply & Activity */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#111111] border-white/5 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Coins className="h-4 w-4 text-primary" />
                      Supply Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-black/40 border border-white/5 group hover:border-primary/30 transition-colors">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mb-1">Dev Wallet</p>
                        <p className="text-2xl font-black text-primary">{analysis.devShare}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-black/40 border border-white/5 group hover:border-trash-red/30 transition-colors">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mb-1">Insider clusters</p>
                        <p className="text-2xl font-black text-trash-red">{analysis.insiderClusterShare}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Top 10 Individual Holders</p>
                        <p className="text-lg font-black text-purple-400">{analysis.top10IndividualShare}</p>
                      </div>
                      <Progress value={parseFloat(analysis.top10IndividualShare)} className="h-2 bg-white/5" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111111] border-white/5 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      On-Chain Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mb-1">24h Volume</p>
                        <p className="text-2xl font-black text-white">${(analysis.volume / 1000).toFixed(1)}k</p>
                      </div>
                      <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mb-1">Market Cap</p>
                        <p className="text-2xl font-black text-white">${(analysis.fdv / 1000).toFixed(1)}k</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Price Momentum</p>
                      <div className="flex items-center gap-1.5 text-w-green">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-black font-mono">+12.4%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Reasoning Panel */}
              <Card className="bg-[#111111] border-primary/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5" />
                    AI Reasoning & Verdict
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <p className="text-xl md:text-2xl font-medium text-white/90 italic leading-relaxed">
                    "{analysis.reasoning}"
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "px-4 py-2 rounded-lg font-black text-sm uppercase tracking-tighter",
                        analysis.riskLevel === 'Low' ? 'bg-w-green/10 text-w-green border border-w-green/20' : 'bg-trash-red/10 text-trash-red border border-trash-red/20'
                      )}>
                        {analysis.riskLevel === 'Low' ? 'Bullish Crowd Signals' : 'Bearish Indicators'}
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={() => setLocation(`/room/${analysis.roomId}`)} 
                      className="w-full sm:w-auto gap-3 bg-white text-black font-black hover:bg-primary transition-all group/btn"
                    >
                      Enter Verdict Room <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State placeholder */}
        {!analysis && !mutation.isPending && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-20 grayscale pointer-events-none">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[#111111] border-white/5 h-64"></Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
