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
              <div className={`p-4 rounded-full ${analysis.verdict === 'W' ? 'bg-w-green/20' : 'bg-trash-red/20'}`}>
                {analysis.verdict === 'W' ? (
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
              <div className={`text-4xl font-black mb-1 ${analysis.verdict === 'W' ? 'text-w-green' : 'text-trash-red'}`}>
                {analysis.verdict === 'W' ? 'W' : 'L'}
              </div>
              <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">AI Verdict</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                  <Users className="h-4 w-4 text-purple-500" />
                  Dev Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.devShare}</div>
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-orange-500" />
                  Rug Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${analysis.rugScore > 70 ? 'text-trash-red' : analysis.rugScore < 30 ? 'text-w-green' : 'text-yellow-500'}`}>
                  {analysis.rugScore}/100
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>AI Reasoning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{analysis.reasoning}</p>
              <div className="mt-8 flex justify-center">
                <Button size="lg" onClick={() => setLocation(`/room/${analysis.roomId}`)} className="gap-2">
                  Visit Voting Room <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
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
