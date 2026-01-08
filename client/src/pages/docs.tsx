import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Vote, BrainCircuit, AlertTriangle, Activity, TrendingUp, ShieldAlert, ChevronRight, Search, ShieldCheck, FlaskConical, Users, MessageSquare } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [rugScore, setRugScore] = useState([15]);
  const [pumpFilter, setPumpFilter] = useState("ALL");

  const sections = [
    { id: "overview", label: "Overview", icon: Zap },
    { id: "how-it-works", label: "How VerdictX Works", icon: ChevronRight },
    { id: "ai-engine", label: "AI Analysis Engine", icon: BrainCircuit },
    { id: "rug-score", label: "Rug Score Explained", icon: ShieldAlert },
    { id: "bonding", label: "Bonding Progress", icon: Activity },
    { id: "pumplist", label: "PumpList", icon: TrendingUp },
    { id: "voting", label: "Voting & Rooms", icon: Vote },
    { id: "faq", label: "FAQ", icon: MessageSquare },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      });
    }
  };

  const getRugScoreColor = (score: number) => {
    if (score <= 30) return "text-[#54d292]";
    if (score <= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getRugScoreBg = (score: number) => {
    if (score <= 30) return "bg-[#54d292]/20 border-[#54d292]/30";
    if (score <= 60) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  const getRugScoreDescription = (score: number) => {
    if (score <= 30) return "Low Risk: Dev wallet is minimal, and holders are distributed. Liquidity profile looks healthy.";
    if (score <= 60) return "Medium Risk: Some insider clusters detected or dev holding a significant portion. Exercise caution.";
    return "High Risk: Extreme concentration of supply or previous rug history linked to dev wallet. Do not interact.";
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#54d292]/30">
      <div className="container max-w-7xl mx-auto flex gap-12 px-4 py-12">
        {/* Left Sidebar - Sticky */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-28 h-fit space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-black uppercase tracking-widest transition-all duration-300",
                activeSection === section.id 
                  ? "bg-[#54d292]/10 text-[#54d292] shadow-[0_0_15px_rgba(84,210,146,0.15)]" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 space-y-32">
          {/* Overview Section */}
          <section id="overview" className="space-y-8 scroll-mt-28">
            <ScrollReveal>
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none">
                  Transparency <br />
                  <span className="text-[#54d292] drop-shadow-[0_0_20px_rgba(84,210,146,0.3)]">beats alpha.</span>
                </h1>
                <p className="text-xl text-zinc-400 font-medium italic max-w-2xl leading-relaxed">
                  Docs should explain how things work, prove we're transparent, and feel alive. Judge tokens before the chart judges you.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#54d292]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="relative text-zinc-300 font-medium leading-relaxed">
                  VerdictX is the public verdict layer for Pump.fun tokens. We don't give "alpha" — we provide raw on-chain truth aggregated through proprietary AI models and community consensus.
                </p>
              </div>
            </ScrollReveal>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="space-y-12 scroll-mt-28">
            <ScrollReveal>
              <h2 className="text-3xl font-black uppercase tracking-tight">How VerdictX Works</h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Paste Contract", desc: "Simply copy and paste any pump.fun token address into our engine." },
                { step: "02", title: "Deep Analysis", desc: "Our AI immediately scans dev wallets, insider clusters, and volume." },
                { step: "03", title: "Verdict Generated", desc: "A final rug score and community consensus are delivered in real-time." }
              ].map((item, i) => (
                <ScrollReveal key={item.step} delay={i * 0.1}>
                  <div className="p-8 bg-zinc-900/50 border border-zinc-800 hover:border-[#54d292]/30 transition-all rounded-xl h-full space-y-4">
                    <span className="text-4xl font-black text-[#54d292]/20 block">{item.step}</span>
                    <h3 className="text-xl font-black uppercase text-white">{item.title}</h3>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* AI Analysis Engine */}
          <section id="ai-engine" className="space-y-12 scroll-mt-28">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tight">AI Analysis Engine</h2>
                  <p className="text-zinc-500 font-medium">Live inspection of on-chain data signals.</p>
                </div>
                <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-[#54d292] animate-pulse">
                  System: Active
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Dev Wallet", value: "12%", icon: ShieldCheck, tip: "Dev wallet share monitored for dumping potential." },
                { label: "Insiders", value: "9%", icon: Search, tip: "Detection of cluster buys before public pump." },
                { label: "Top Holders", value: "41%", icon: Users, tip: "Wallets are tracked for concentration risk." },
                { label: "Bonding", value: "67%", icon: Activity, tip: "Real-time progress toward Raydium migration." }
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <div className="group relative p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-[#54d292]/30 transition-all cursor-help overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <stat.icon className="w-4 h-4 text-[#54d292]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</span>
                    </div>
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-black text-white"
                    >
                      {stat.value}
                    </motion.div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute inset-0 bg-black/90 p-4 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-[10px] text-zinc-300 font-medium italic">{stat.tip}</p>
                      <p className="text-[9px] text-[#54d292] font-black mt-2 uppercase">Wallets never shown publicly.</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Rug Score Slider */}
          <section id="rug-score" className="space-y-12 scroll-mt-28">
            <ScrollReveal>
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight">Rug Score Logic</h2>
                <p className="text-zinc-500 font-medium">Interactive breakdown of risk assessment.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="p-8 md:p-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Risk Assessment</span>
                      <div className={cn("text-5xl font-black transition-colors duration-500", getRugScoreColor(rugScore[0]))}>
                        {rugScore[0]} <span className="text-xl text-zinc-700">/ 100</span>
                      </div>
                    </div>
                    <div className={cn("px-4 py-2 rounded-lg font-black uppercase text-xs transition-all duration-500", getRugScoreBg(rugScore[0]))}>
                      {rugScore[0] <= 30 ? "SAFE" : rugScore[0] <= 60 ? "CAUTION" : "EXTREME RISK"}
                    </div>
                  </div>
                  
                  <Slider 
                    value={rugScore} 
                    onValueChange={setRugScore} 
                    max={100} 
                    step={1} 
                    className="py-4"
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={rugScore[0] <= 30 ? "low" : rugScore[0] <= 60 ? "med" : "high"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 bg-black/40 border border-zinc-800/50 rounded-xl"
                  >
                    <p className="text-zinc-300 font-medium leading-relaxed italic">
                      {getRugScoreDescription(rugScore[0])}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </section>

          {/* Bonding Progress */}
          <section id="bonding" className="space-y-12 scroll-mt-28">
            <ScrollReveal>
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight">Bonding Progress</h2>
                <p className="text-zinc-500 font-medium">Why migration speed matters.</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal delay={0.2} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase text-white">Migration Mechanism</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">
                    Once bonding reaches 100%, liquidity is automatically migrated to Raydium. Low bonding progress (under 20%) paired with a high rug score is a massive red flag.
                  </p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Faster bonding = higher momentum",
                    "Low bonding + low votes = dead token",
                    "Real-time sync with Pump.fun mempool"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#54d292]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-zinc-500">Current Progress</span>
                      <span className="text-[#54d292]">84.2%</span>
                    </div>
                    <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "84.2%" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-[#54d292] shadow-[0_0_20px_rgba(84,210,146,0.5)]"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-lg border border-zinc-800/50">
                    <p className="text-[10px] font-mono text-zinc-500 leading-relaxed uppercase tracking-widest">
                      Status: Token is approaching migration threshold. Buy signals are currently stable.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* PumpList Preview */}
          <section id="pumplist" className="space-y-12 scroll-mt-28">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tight">PumpList Categories</h2>
                  <p className="text-zinc-500 font-medium">How we categorize trending tokens.</p>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  {["ALL", "SAFE", "RISK"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setPumpFilter(f)}
                      className={cn(
                        "px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all",
                        pumpFilter === f ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Alpha SOL", risk: "SAFE", rug: "2/100" },
                { name: "Pepe Rocket", risk: "RISK", rug: "84/100" },
                { name: "Verdict AI", risk: "SAFE", rug: "0/100" }
              ].filter(t => pumpFilter === "ALL" || t.risk === pumpFilter).map((token, i) => (
                <ScrollReveal key={token.name} delay={i * 0.1}>
                  <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black uppercase text-white">{token.name}</h4>
                      <div className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                        token.risk === "SAFE" ? "bg-[#54d292]/20 text-[#54d292]" : "bg-red-500/20 text-red-500"
                      )}>
                        {token.risk}
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                      <span>Rug Score</span>
                      <span className={token.risk === "SAFE" ? "text-[#54d292]" : "text-red-500"}>{token.rug}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Voting & Rooms */}
          <section id="voting" className="space-y-12 scroll-mt-28">
            <ScrollReveal>
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight">Voting & Rooms</h2>
                <p className="text-zinc-500 font-medium">Community signals simplified.</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal delay={0.2}>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-[#54d292]">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase text-white italic">"W" or "Trash"</h3>
                      <p className="text-zinc-400 font-medium leading-relaxed">
                        Votes are permanent and linked to wallet addresses to prevent bot spam. No personal wallet names are ever shown publicly.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-4">
                    {[
                      { msg: "Clean dev wallet history, bullish.", type: "W" },
                      { msg: "Dev holding 15% in stealth wallets.", type: "Trash" }
                    ].map((chat, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Anon-721</span>
                            <span className={cn(
                              "text-[8px] font-black uppercase px-1 rounded",
                              chat.type === "W" ? "bg-[#54d292]/20 text-[#54d292]" : "bg-red-500/20 text-red-500"
                            )}>{chat.type}</span>
                          </div>
                          <p className="text-xs text-zinc-300 font-medium">{chat.msg}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4} className="space-y-4">
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#54d292]">Room Mechanics</h4>
                  <ul className="space-y-4">
                    {[
                      "Real-time chat for every token",
                      "Aggregated voting percentage bar",
                      "Audit badges for verified tokens"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-medium italic">
                        <ChevronRight className="w-4 h-4 text-[#54d292]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-12 scroll-mt-28">
            <ScrollReveal>
              <h2 className="text-3xl font-black uppercase tracking-tight">FAQ</h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "Is VerdictX financial advice?", a: "No. VerdictX provides data signals and crowd sentiment. All trading carries risk. DYOR." },
                  { q: "How fast is the on-chain data updated?", a: "Our engine polls the Solana mempool every 500ms for real-time accuracy." },
                  { q: "Can a token change its rug score?", a: "Yes. Scores fluctuate based on real-time wallet activity and bonding progress." },
                  { q: "What does the AI analyze exactly?", a: "Dev wallet history, previous token associations, insider cluster buys, and liquidity safety." }
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border border-zinc-800 bg-zinc-900/30 rounded-xl px-6 data-[state=open]:border-[#54d292]/50 transition-all">
                    <AccordionTrigger className="text-left font-black uppercase tracking-tight hover:no-underline hover:text-[#54d292] transition-colors">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-zinc-400 font-medium leading-relaxed pb-6">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          </section>

          {/* Footer Trust */}
          <footer className="pt-20 pb-10 text-center border-t border-zinc-900">
            <ScrollReveal>
              <div className="flex flex-col items-center gap-6">
                <div className="p-4 bg-[#54d292]/10 rounded-2xl border border-[#54d292]/20">
                  <ShieldCheck className="w-12 h-12 text-[#54d292]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Built for Truth.</h3>
                  <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">VerdictX • On-Chain Truth Engine © 2026</p>
                </div>
              </div>
            </ScrollReveal>
          </footer>
        </main>
      </div>
    </div>
  );
}

