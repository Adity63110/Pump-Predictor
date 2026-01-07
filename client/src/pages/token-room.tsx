import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { mockService, Token } from "@/lib/mock-service";
import { Button } from "@/components/ui/button";
import { VotingBar } from "@/components/voting-bar";
import { RugScale } from "@/components/rug-scale";
import { ChatBox } from "@/components/chat-box";
import { 
  ArrowLeft, Copy, ExternalLink, ThumbsUp, ThumbsDown, AlertOctagon, Share2, Activity,
  BrainCircuit, ShieldAlert, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TokenRoom() {
  const [, params] = useRoute("/room/:id");
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'w' | 'trash' | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      // Try to fetch market, if not found, it might be a CA that needs analysis
      fetch(`/api/markets/${params.id}`)
        .then(async res => {
          if (res.status === 404 && params.id?.length && params.id.length > 30) {
            // Likely a Solana CA, try to trigger analysis/creation
            try {
              // We'll fetch analysis in background to show token info faster
              fetch("/api/ai/analyse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ca: params.id })
              })
              .then(res => res.json())
              .then(data => {
                setAnalysis(data);
                // After creation, we might want to refresh token if it was just created
                fetch(`/api/markets/${data.roomId}`).then(r => r.json()).then(setToken);
              })
              .catch(console.error);

              // Try to find it on dexscreener directly for immediate display
              const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${params.id}`);
              const dexData = await dexRes.json();
              const pair = dexData.pairs?.[0];
              if (pair) {
                return {
                  id: params.id,
                  name: pair.baseToken.name,
                  symbol: pair.baseToken.symbol,
                  ca: params.id,
                  imageUrl: pair.info?.imageUrl || "",
                  marketCap: Math.floor(pair.fdv || 0),
                  launchTime: new Date().toISOString(),
                  devWalletPct: "0",
                  rugScale: 0,
                  wVotes: 0,
                  trashVotes: 0
                };
              }
            } catch (err) {
              console.error("Immediate fetch error:", err);
            }
          }
          
          if (!res.ok) throw new Error("Not found");
          return await res.json();
        })
        .then((t) => {
          setToken(t || null);
          setLoading(false);
          
          // Check if user has already voted
          const savedVote = localStorage.getItem(`vote_${params.id}`);
          if (savedVote) {
            setUserVote(savedVote as 'w' | 'trash');
          }

          // If we have a token but no analysis yet, fetch it in background
          if (t && t.ca && !analysis) {
            fetch("/api/ai/analyse", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ca: t.ca })
            })
            .then(res => res.json())
            .then(setAnalysis)
            .catch(console.error);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [params?.id]);

  const handleVote = async (type: 'w' | 'trash') => {
    if (!token) return;
    
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId: token.id,
          type: type.toUpperCase()
        })
      });

      if (!res.ok) throw new Error("Vote failed");

      // Update state and persistence
      setUserVote(type);
      localStorage.setItem(`vote_${token.id}`, type);
      
      // Refresh token data to show updated counts
      const updatedRes = await fetch(`/api/markets/${token.id}`);
      const updatedToken = await updatedRes.json();
      setToken(updatedToken);
      
      toast({
        title: type === 'w' ? "Voted W 🟢" : "Voted Trash 🔴",
        description: "Your signal has been recorded.",
        duration: 2000,
        className: type === 'w' ? "border-w-green text-w-green" : "border-trash-red text-trash-red"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cast vote. One vote per IP allowed.",
        variant: "destructive"
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center font-mono animate-pulse text-muted-foreground">
      SCANNING MEMPOOL...
    </div>
  );

  if (!token) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
      <Link href="/">
        <Button variant="outline">Return Home</Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div className="font-mono text-sm flex items-center gap-2">
            <span className="text-muted-foreground hidden sm:inline">CA:</span>
            <span className="bg-secondary/50 px-2 py-1 rounded text-xs truncate max-w-[120px] sm:max-w-none">{token.ca}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-muted-foreground" onClick={() => {
                navigator.clipboard.writeText(token.ca);
                toast({ title: "Copied CA" });
            }}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Info & Chart */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Token Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold ring-2 ring-border">
                {token.imageUrl ? <img src={token.imageUrl} className="w-full h-full rounded-full object-cover" /> : (token.symbol ? token.symbol[0] : "?")}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                  {token.name} <span className="text-muted-foreground text-lg font-mono font-normal">/ {token.symbol}</span>
                </h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground font-mono">
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> MC: ${((token.marketCap || 0) / 1000).toFixed(0)}k</span>
                  <span className="flex items-center gap-1 text-trash-red"><AlertOctagon className="w-3 h-3" /> Dev: {token.devWalletPct || 0}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="gap-2">
                 <ExternalLink className="w-4 h-4" /> DexScreener
               </Button>
               <Button variant="outline" size="sm" className="gap-2">
                 <Share2 className="w-4 h-4" /> Share Room
               </Button>
            </div>
          </div>

          {/* Chart Area (DexScreener Embed) */}
          <div className="h-[500px] w-full bg-card/30 rounded-xl border border-border/50 overflow-hidden relative group">
            <iframe 
              src={`https://dexscreener.com/solana/${token.ca}?embed=1&theme=dark&trades=0&info=0`}
              style={{ width: '100%', height: '100%', border: '0' }}
              title="DexScreener Chart"
            />
          </div>

          {/* Voting Action Area */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-xl relative overflow-hidden">
             {/* Background Glow based on majority */}
             <div className={cn("absolute inset-0 opacity-5 pointer-events-none", 
                ((token as any).wVotes || 0) > ((token as any).trashVotes || 0) ? "bg-w-green" : "bg-trash-red"
             )} />
             
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Public Verdict
                <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {((token as any).wVotes || 0) + ((token as any).trashVotes || 0)} votes
                </span>
             </h2>

             <VotingBar wVotes={(token as any).wVotes || 0} trashVotes={(token as any).trashVotes || 0} className="mb-8" />

             <div className="grid grid-cols-2 gap-4">
                <Button 
                    size="lg" 
                    className={cn(
                        "h-28 text-4xl font-black uppercase tracking-tighter transition-all flex flex-col items-center justify-center gap-1",
                        "bg-w-green text-white hover:brightness-110 active:scale-95 shadow-lg shadow-w-green/20",
                        userVote === 'w' ? "ring-4 ring-white" : (userVote !== null ? "opacity-30 grayscale" : "")
                    )}
                    onClick={() => handleVote('w')}
                    disabled={userVote !== null}
                >
                    <ThumbsUp className="w-10 h-10" />
                    <span>W</span>
                </Button>

                <Button 
                    size="lg" 
                    className={cn(
                        "h-28 text-4xl font-black uppercase tracking-tighter transition-all flex flex-col items-center justify-center gap-1",
                        "bg-trash-red text-white hover:brightness-110 active:scale-95 shadow-lg shadow-trash-red/20",
                        userVote === 'trash' ? "ring-4 ring-white" : (userVote !== null ? "opacity-30 grayscale" : "")
                    )}
                    onClick={() => handleVote('trash')}
                    disabled={userVote !== null}
                >
                    <ThumbsDown className="w-10 h-10" />
                    <span>TRASH</span>
                </Button>
             </div>
             
             {userVote && (
                 <p className="text-center text-xs text-muted-foreground mt-4 animate-in fade-in slide-in-from-bottom-2">
                     Your verdict has been recorded.
                 </p>
             )}
          </div>
        </div>

        {/* Right Column: Data & Chat */}
        <div className="lg:col-span-4 space-y-6">
            <RugScale score={token.rugScale || 0} />
            
            {analysis && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                    AI Deep Analysis
                  </CardTitle>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                    analysis.riskLevel === 'Low' ? 'bg-w-green/10 text-w-green border-w-green/20' : 
                    analysis.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                    'bg-trash-red/10 text-trash-red border-trash-red/20'
                  )}>
                    {analysis.riskLevel} RISK
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm italic leading-relaxed text-foreground/90 mb-4">"{analysis.reasoning}"</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2 rounded bg-background/50 border border-border/50">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">Dev Share</p>
                      <p className="text-sm font-bold text-primary">{analysis.devShare}</p>
                    </div>
                    <div className="p-2 rounded bg-background/50 border border-border/50">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">Insiders</p>
                      <p className="text-sm font-bold text-trash-red">{analysis.insiderClusterShare}</p>
                    </div>
                  </div>

                  {analysis.redFlags && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Risk Signals
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {analysis.redFlags.map((flag: string, i: number) => (
                          <span key={i} className="text-[9px] bg-muted px-1.5 py-0.5 rounded border border-border">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Top 10</div>
                        <div className="text-lg font-mono font-bold text-yellow-500">14.5%</div>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Vol (24h)</div>
                        <div className="text-lg font-mono font-bold">${(token as any).volume24h ? ((token as any).volume24h / 1000).toFixed(1) + 'k' : 'N/A'}</div>
                    </div>
                </div>
            </div>

            <ChatBox />
        </div>

      </main>
    </div>
  );
}
