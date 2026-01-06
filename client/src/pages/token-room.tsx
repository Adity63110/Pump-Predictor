import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { mockService, Token } from "@/lib/mock-service";
import { Button } from "@/components/ui/button";
import { VotingBar } from "@/components/voting-bar";
import { RugScale } from "@/components/rug-scale";
import { ChatBox } from "@/components/chat-box";
import { ArrowLeft, Copy, ExternalLink, ThumbsUp, ThumbsDown, AlertOctagon, Share2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
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
      mockService.getToken(params.id).then((t) => {
        setToken(t || null);
        setLoading(false);
      });
    }
  }, [params?.id]);

  const handleVote = async (type: 'w' | 'trash') => {
    if (!token) return;
    
    // Optimistic update
    setUserVote(type);
    setToken(prev => {
      if (!prev) return null;
      return {
        ...prev,
        votes: {
          w: type === 'w' ? prev.votes.w + 1 : prev.votes.w,
          trash: type === 'trash' ? prev.votes.trash + 1 : prev.votes.trash
        }
      };
    });

    await mockService.vote(token.id, type);
    
    toast({
      title: type === 'w' ? "Voted W 🟢" : "Voted Trash 🔴",
      description: "Your signal has been recorded on-chain (simulated).",
      duration: 2000,
      className: type === 'w' ? "border-w-green text-w-green" : "border-trash-red text-trash-red"
    });
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
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> MC: ${(token.marketCap / 1000).toFixed(0)}k</span>
                  <span className="flex items-center gap-1 text-trash-red"><AlertOctagon className="w-3 h-3" /> Dev: {token.devWalletPct}%</span>
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

          {/* Chart Area (Simplified Visualization) */}
          <div className="h-[300px] w-full bg-card/30 rounded-xl border border-border/50 p-4 relative overflow-hidden group">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <span className="text-xs bg-black/50 px-2 py-1 rounded text-w-green font-mono">LIVE</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={token.chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Voting Action Area */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-xl relative overflow-hidden">
             {/* Background Glow based on majority */}
             <div className={cn("absolute inset-0 opacity-5 pointer-events-none", 
                token.votes.w > token.votes.trash ? "bg-w-green" : "bg-trash-red"
             )} />
             
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Public Verdict
                <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {token.votes.w + token.votes.trash} votes
                </span>
             </h2>

             <VotingBar wVotes={token.votes.w} trashVotes={token.votes.trash} className="mb-8" />

             <div className="grid grid-cols-2 gap-4">
                <Button 
                    size="lg" 
                    className={cn(
                        "h-20 text-xl font-bold uppercase tracking-wider transition-all border-2",
                        userVote === 'w' ? "bg-w-green/20 text-w-green border-w-green ring-2 ring-w-green/50" : "bg-secondary/50 hover:bg-w-green/10 hover:text-w-green hover:border-w-green/50 border-transparent"
                    )}
                    onClick={() => handleVote('w')}
                    disabled={userVote !== null}
                >
                    <ThumbsUp className="w-6 h-6 mr-2" /> W (Hold)
                </Button>

                <Button 
                    size="lg" 
                    className={cn(
                        "h-20 text-xl font-bold uppercase tracking-wider transition-all border-2",
                        userVote === 'trash' ? "bg-trash-red/20 text-trash-red border-trash-red ring-2 ring-trash-red/50" : "bg-secondary/50 hover:bg-trash-red/10 hover:text-trash-red hover:border-trash-red/50 border-transparent"
                    )}
                    onClick={() => handleVote('trash')}
                    disabled={userVote !== null}
                >
                    <ThumbsDown className="w-6 h-6 mr-2" /> Trash (Rug)
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
            <RugScale score={token.rugScale} />
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Holders</div>
                        <div className="text-lg font-mono font-bold">1,240</div>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Liquidity</div>
                        <div className="text-lg font-mono font-bold">$45.2k</div>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Top 10</div>
                        <div className="text-lg font-mono font-bold text-yellow-500">14.5%</div>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Vol (24h)</div>
                        <div className="text-lg font-mono font-bold">$120k</div>
                    </div>
                </div>
            </div>

            <ChatBox />
        </div>

      </main>
    </div>
  );
}
