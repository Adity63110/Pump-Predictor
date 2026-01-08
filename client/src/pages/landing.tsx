import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, TrendingUp, BrainCircuit, FileText, Zap, Search, Activity, AlertTriangle, CheckCircle2, Loader2, ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { type Market } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandingPage() {
  const { data: markets, isLoading } = useQuery<Market[]>({
    queryKey: ["/api/markets"],
  });

  const trendingMarkets = markets?.slice(0, 3) || [];

  const faqItems = [
    {
      q: "What is VerdictX?",
      a: "VerdictX is an AI-powered analysis platform for pump.fun tokens that combines on-chain intelligence with real community voting to assess risk and sentiment."
    },
    {
      q: "Does VerdictX show wallet addresses?",
      a: "No. VerdictX never displays wallet addresses. Only percentages and aggregated signals are shown to protect privacy and prevent misuse."
    },
    {
      q: "How is the rug score calculated?",
      a: "The rug score is generated using multiple factors including dev wallet exposure, insider concentration, holder distribution, bonding progress, and trading behavior."
    },
    {
      q: "Is the data real or simulated?",
      a: "All analysis is based on real on-chain data. Community votes are recorded live and reflected instantly."
    },
    {
      q: "Can anyone vote on a token?",
      a: "Yes. Any user can participate in voting and discussion rooms once a token is analyzed."
    },
    {
      q: "Is VerdictX financial advice?",
      a: "No. VerdictX provides data and insights only. All trading decisions are your own."
    }
  ];

  return (
    <div className="bg-black text-white font-sans selection:bg-[#54d292]/30 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-[#54d292]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left space-y-8">
            <ScrollReveal>
              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none uppercase">
                Know before <br />
                <span className="text-[#54d292] drop-shadow-[0_0_20px_rgba(84,210,146,0.4)]">you ape.</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <p className="text-xl sm:text-2xl text-zinc-400 max-w-xl font-medium leading-relaxed">
                AI-powered on-chain verdicts for pump.fun tokens. <br />
                Dev wallets, insiders, bonding progress, rug score. <br />
                <span className="text-white">No addresses. Just truth.</span>
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="flex flex-wrap gap-4">
              <Link href="/markets">
                <Button size="lg" className="h-14 px-10 font-black text-lg bg-[#54d292] text-black hover:bg-white transition-all rounded-lg uppercase group">
                  Analyze Token <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pumplist">
                <Button size="lg" variant="outline" className="h-14 px-10 font-black text-lg border-zinc-800 text-white hover:bg-zinc-900 transition-all rounded-lg uppercase">
                  View PumpList
                </Button>
              </Link>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3} className="hidden lg:block">
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative p-8 bg-zinc-900/50 backdrop-blur-xl border border-[#54d292]/20 rounded-2xl shadow-2xl shadow-[#54d292]/10"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase text-[#54d292]">VerdictX Analysis</h3>
                  <div className="px-3 py-1 bg-[#54d292]/20 text-[#54d292] rounded text-xs font-bold uppercase">Safe</div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase text-zinc-500">
                      <span>Rug Score</span>
                      <span className="text-[#54d292]">2/100</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "2%" }}
                        className="h-full bg-[#54d292]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase text-zinc-500">
                      <span>Bonding Progress</span>
                      <span className="text-[#54d292]">84%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "84%" }}
                        className="h-full bg-[#54d292]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full rotate-[-90deg]">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                        <motion.circle 
                          initial={{ strokeDashoffset: 364 }}
                          whileInView={{ strokeDashoffset: 364 - (364 * 0.12) }}
                          cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364" 
                          className="text-[#54d292]"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white">12%</span>
                        <span className="text-[8px] font-bold text-zinc-500 uppercase">Insiders</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute -inset-0.5 bg-[#54d292] rounded-2xl blur opacity-20 pointer-events-none" />
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Trust Strip */}
      <section className="border-y border-zinc-800 bg-black/50 backdrop-blur py-8 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
            {[
              { label: "Dev Wallet %", value: "Verified" },
              { label: "Insider Wallet %", value: "Tracked" },
              { label: "Top Holders %", value: "Scanned" },
              { label: "Bonding Progress", value: "Live" },
              { label: "Volume", value: "Real-time" }
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} className="flex flex-col items-center md:items-start">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{stat.label}</span>
                <span className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#54d292]" />
                  {stat.value}
                </span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI Analyzer Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-4">What VerdictX Checks</h2>
          <p className="text-zinc-500 font-medium">Deep on-chain inspection before you hit the buy button.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Dev Control", desc: "Analyzes dev wallet history and previous rug patterns.", icon: ShieldCheck },
            { title: "Insider Accumulation", desc: "Tracks stealth wallets and cluster buys before pump.", icon: Search },
            { title: "Holder Distribution", desc: "Checks for massive wallet concentration and snipers.", icon: TrendingUp },
            { title: "Bonding Curve", desc: "Real-time analysis of the pump.fun bonding mechanics.", icon: Activity },
            { title: "Volume Authenticity", desc: "Detects wash trading and artificial volume spikes.", icon: BrainCircuit },
            { title: "Verdict System", desc: "Proprietary AI scoring from SAFE to EXTREME RISK.", icon: AlertTriangle }
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="group p-8 bg-zinc-900/30 border border-zinc-800 hover:border-[#54d292]/50 transition-all rounded-xl h-full">
                <item.icon className="w-10 h-10 text-[#54d292] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-black uppercase mb-3 text-white">{item.title}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. PumpList Section */}
      <section className="py-24 px-4 bg-zinc-900/20">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 px-2">
            <div>
              <ScrollReveal>
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">Top Trending</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-[#54d292] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#54d292]">Curated & Verified</span>
                </div>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.1}>
              <Link href="/pumplist">
                <Button variant="ghost" className="text-zinc-400 hover:text-[#54d292] font-bold uppercase">
                  View Full List <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                  <Skeleton className="h-10 w-full mb-6 bg-zinc-800" />
                  <Skeleton className="h-4 w-full mb-2 bg-zinc-800" />
                  <Skeleton className="h-4 w-2/3 bg-zinc-800" />
                </div>
              ))
            ) : trendingMarkets.map((token, i) => (
              <ScrollReveal key={token.id} delay={i * 0.1}>
                <Link href={`/market/${token.id}`}>
                  <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-[#54d292]/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-[#54d292]/10 flex items-center justify-center font-black text-[#54d292]">
                          {token.symbol[0]}
                        </div>
                        <div>
                          <h4 className="font-black uppercase text-white leading-none">{token.name}</h4>
                          <span className="text-[10px] font-mono text-zinc-500">${token.symbol}</span>
                        </div>
                      </div>
                      <div className={cn(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                        token.rugScale <= 30 ? "bg-[#54d292]/20 text-[#54d292]" : "bg-yellow-500/20 text-yellow-500"
                      )}>
                        {token.rugScale <= 30 ? "Safe" : "Caution"}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="text-zinc-500">Rug Score</span>
                        <span className="text-white">{token.rugScale}/100</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className="text-zinc-500">Volume</span>
                          <span className="text-[#54d292]">${(token.volume24h / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#54d292]" style={{ width: `${Math.min((token.volume24h / 100000) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-20">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">How It Works</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />
          
          {[
            { step: "01", title: "Paste CA", desc: "Simply copy and paste any pump.fun contract address.", icon: Search },
            { step: "02", title: "AI Analysis", desc: "Our engine scans millions of on-chain data points instantly.", icon: BrainCircuit },
            { step: "03", title: "Verdict", desc: "Receive a clear, no-fluff verdict on the token safety.", icon: ShieldCheck }
          ].map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 0.2} className="text-center space-y-6">
              <div className="w-20 h-20 bg-black border-2 border-[#54d292] rounded-2xl flex items-center justify-center mx-auto rotate-3 hover:rotate-0 transition-transform duration-500">
                <item.icon className="w-10 h-10 text-[#54d292]" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase text-white mb-2">{item.title}</h3>
                <p className="text-zinc-500 font-medium">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 6. Docs Teaser */}
      <section className="py-24 px-4 bg-zinc-900/10">
        <div className="container max-w-4xl mx-auto text-center border border-zinc-800 p-12 rounded-2xl bg-black/40 backdrop-blur">
          <ScrollReveal>
            <h2 className="text-3xl font-black uppercase mb-6">Want to know how verdicts are calculated?</h2>
            <p className="text-zinc-500 mb-10 max-w-xl mx-auto font-medium">
              We believe in full transparency. Read our documentation to understand our scoring methodology and AI model logic.
            </p>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="border-zinc-800 text-white hover:bg-zinc-900 font-bold uppercase tracking-widest px-10">
                <FileText className="mr-2 w-5 h-5" /> Read Docs
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-24 px-4 max-w-3xl mx-auto border-t border-zinc-900/50">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Frequently Asked</h2>
          <div className="w-20 h-1 bg-[#54d292] mx-auto rounded-full" />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`} 
                className="border border-zinc-800 bg-zinc-900/20 rounded-xl px-6 data-[state=open]:border-[#54d292]/40 data-[state=open]:bg-zinc-900/40 data-[state=open]:shadow-[0_0_30px_rgba(84,210,146,0.05)] transition-all duration-300 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-black uppercase tracking-tight hover:no-underline py-6 group">
                  <span className="flex-1 group-data-[state=open]:text-[#54d292] transition-colors">
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400 font-medium leading-relaxed pb-6 text-sm">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </section>

      {/* 8. Final CTA */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#54d292]/5 to-transparent pointer-events-none" />
        <ScrollReveal>
          <h2 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter mb-10 leading-none">
            Don’t guess.<br />
            <span className="text-[#54d292]">Get a verdict.</span>
          </h2>
          <Link href="/markets">
            <Button size="lg" className="h-20 px-16 font-black text-2xl bg-[#54d292] text-black hover:bg-white transition-all rounded-xl uppercase shadow-[0_0_50px_rgba(84,210,146,0.2)]">
              Analyze a Token
            </Button>
          </Link>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.3em]">© 2026 VerdictX • On-Chain Truth Engine</p>
      </footer>
    </div>
  );
}

