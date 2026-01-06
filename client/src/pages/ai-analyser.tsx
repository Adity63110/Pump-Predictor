import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2, Search, ArrowRight, ShieldCheck, ShieldAlert, Coins, Users, Activity } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AIAnalyser() {
  const [ca, setCa] = useState("");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ca.trim()) {
      mutation.mutate(ca);
    }
  };

  const analysis = mutation.data;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
          <BrainCircuit className="h-10 w-10 text-primary" />
          AI Analyser
        </h1>
        <p className="text-xl text-muted-foreground">
          Enter a token's contract address for a deep-dive AI verdict.
        </p>
        
        <form onSubmit={handleSearch} className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Paste CA..." 
              className="pl-9 h-12"
              value={ca}
              onChange={(e) => setCa(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          <Button type="submit" size="lg" className="h-12" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Analyse
          </Button>
        </form>
      </div>

      {mutation.isPending && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium animate-pulse">Scanning on-chain data, analysing holders, and running risk models...</p>
        </div>
      )}

      {analysis && !mutation.isPending && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${analysis.riskLevel === 'Low' ? 'bg-w-green/20' : analysis.riskLevel === 'Medium' ? 'bg-yellow-500/20' : 'bg-trash-red/20'}`}>
                {analysis.riskLevel === 'Low' ? (
                  <ShieldCheck className="h-10 w-10 text-w-green" />
                ) : (
                  <ShieldAlert className="h-10 w-10 text-trash-red" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{analysis.name} (${analysis.symbol})</h2>
                <p className="text-muted-foreground font-mono text-sm">{ca}</p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-black mb-1 ${analysis.riskLevel === 'Low' ? 'text-w-green' : analysis.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-trash-red'}`}>
                {analysis.riskLevel}
              </div>
              <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">AI Risk Level</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Supply Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded bg-background border border-border/50">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Dev Wallet</p>
                      <p className="text-lg font-bold text-primary">{analysis.devShare}</p>
                    </div>
                    <div className="p-3 rounded bg-background border border-border/50">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Insider Clusters</p>
                      <p className="text-lg font-bold text-trash-red">{analysis.insiderClusterShare}</p>
                    </div>
                    <div className="p-3 rounded bg-background border border-border/50">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Top 10 Holders</p>
                      <p className="text-lg font-bold text-purple-500">{analysis.top10IndividualShare}</p>
                    </div>
                    <div className="p-3 rounded bg-background border border-border/50">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Locked/Burned</p>
                      <p className="text-lg font-bold text-w-green">{analysis.lockedBurnedShare}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {analysis.devDetectionTrail && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Dev Detection Trail
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.devDetectionTrail.map((trail: any, i: number) => (
                      <div key={i} className={`flex items-start gap-3 p-2 rounded border ${trail.detected ? 'bg-background border-primary/20' : 'opacity-40 grayscale border-transparent'}`}>
                        <div className={`mt-1 p-1 rounded-full ${trail.detected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {trail.detected ? <ShieldCheck className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-xs font-bold truncate">{trail.pattern}</span>
                            {trail.detected && <span className="text-[10px] bg-primary/10 text-primary px-1 rounded uppercase tracking-tighter">Matched</span>}
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate font-mono">{trail.wallet}</p>
                          <p className="text-[10px] italic leading-tight mt-0.5">{trail.detail}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      Inferred Holder Clusters
                    </div>
                    {analysis.topConcentration && (
                      <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                        Top 5: {analysis.topConcentration}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(analysis.topHolders) ? analysis.topHolders.map((holder: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                            {holder.address}
                          </div>
                          <span className="text-sm font-semibold">{holder.label}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-primary">{holder.amount}</span>
                          {parseFloat(holder.amount) >= 0.2 && (
                            <span className="text-[10px] text-trash-red font-bold uppercase tracking-tighter">Insider Risk</span>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-muted-foreground py-4 italic">No cluster data available</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {analysis.redFlags && analysis.redFlags.length > 0 && (
                <Card className="border-trash-red/50 bg-trash-red/5">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-trash-red flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      Detected Red Flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-sm text-trash-red/90 font-medium">
                      {analysis.redFlags.map((flag: string, i: number) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      Volume (24h)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(analysis.volume / 1000).toFixed(1)}k</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      Market Cap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(analysis.fdv / 1000).toFixed(1)}k</div>
                  </CardContent>
                </Card>
              </div>

          <Card className="bg-primary/5 border-primary/20 flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI Reasoning & Verdict</CardTitle>
              <div className={`px-4 py-1 rounded-full text-sm font-bold border ${
                analysis.riskLevel === 'Low' 
                  ? 'bg-w-green/10 text-w-green border-w-green/20' 
                  : analysis.riskLevel === 'Medium'
                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  : 'bg-trash-red/10 text-trash-red border-trash-red/20'
              }`}>
                {analysis.riskLevel === 'Low' ? 'BULLISH SIGNALS' : analysis.riskLevel === 'Medium' ? 'NEUTRAL SIGNALS' : 'BEARISH SIGNALS'}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-foreground/90 italic">"{analysis.reasoning}"</p>
              <div className="mt-8 flex justify-center">
                <Button size="lg" onClick={() => setLocation(`/room/${analysis.roomId}`)} className="gap-2 shadow-lg hover-elevate">
                  Enter Community Verdict Room <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      )}

      {!analysis && !mutation.isPending && (
        <div className="grid gap-6 md:grid-cols-3 opacity-50">
          <Card>
            <CardHeader><CardTitle className="text-lg">Holder Distribution</CardTitle></CardHeader>
            <CardContent><div className="h-24 bg-muted rounded animate-pulse" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Liquidity Depth</CardTitle></CardHeader>
            <CardContent><div className="h-24 bg-muted rounded animate-pulse" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Risk Metrics</CardTitle></CardHeader>
            <CardContent><div className="h-24 bg-muted rounded animate-pulse" /></CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
