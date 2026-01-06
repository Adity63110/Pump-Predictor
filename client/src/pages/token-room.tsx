import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { mockService, Token } from "@/lib/mock-service";
import { Button } from "@/components/ui/button";
import { VotingBar } from "@/components/voting-bar";
import { RugScale } from "@/components/rug-scale";
import { ChatBox } from "@/components/chat-box";
import { ArrowLeft, Copy, ExternalLink, ThumbsUp, ThumbsDown, AlertOctagon, Share2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function TokenRoom() {
  const [, params] = useRoute("/room/:id");
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'w' | 'trash' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      // Fetch token from real API instead of mock
      fetch(`/api/markets/${params.id}`)
        .then(res => res.json())
        .then((t) => {
          setToken(t || null);
          setLoading(false);
          
          // Check if user has already voted (simulated with local storage for now, 
          // or we could add an endpoint to check by IP/Fingerprint)
          const savedVote = localStorage.getItem(`vote_${params.id}`);
          if (savedVote) {
            setUserVote(savedVote as 'w' | 'trash');
          }
        });
    }
  }, [params?.id]);

  const handleVote = async (type: 'w' | 'trash') => {
    if (!token) return;
    
    try {
      // Create a temporary wallet ID for the user if not exists
      let voterWallet = localStorage.getItem('voter_wallet');
      if (!voterWallet) {
        voterWallet = 'user_' + Math.random().toString(36).substring(7);
        localStorage.setItem('voter_wallet', voterWallet);
      }

      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId: token.id,
          voterWallet: voterWallet,
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
        description: "Failed to cast vote. Please try again.",
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
                {token.imageUrl ? <img src={token.imageUrl} className="w-full h-full rounded-full object-cover" /> : token.symbol[0]}
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
                     Voting locked for 10 minutes to prevent manipulation.
                 </p>
             )}
          </div>
        </div>

        {/* Right Column: Data & Chat */}
        <div className="lg:col-span-4 space-y-6">
            <RugScale score={token.rugScale || 0} />
            
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
