import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Vote, BrainCircuit, AlertTriangle, Activity, TrendingUp, ShieldAlert } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      title: "1️⃣ What is VX?",
      icon: Zap,
      content: [
        "Users paste a token CA",
        "Create a voting room",
        "Vote W or Trash",
        "Chat with other traders",
        "See rug risk, bonding progress, and holder stats"
      ]
    },
    {
      title: "2️⃣ How Voting Works",
      icon: Vote,
      content: [
        "One vote per wallet per token",
        "Votes are stored permanently",
        "Show % W votes and % Trash votes",
        "No wallet addresses shown publicly"
      ]
    },
    {
      title: "3️⃣ AI Analyzer",
      icon: BrainCircuit,
      content: [
        "Dev wallet holding %",
        "Insider wallet concentration",
        "Top holders %",
        "Bonding curve progress",
        "Community sentiment",
        "Note: AI does NOT give financial advice. It gives signals."
      ]
    },
    {
      title: "4️⃣ Rug Score",
      icon: ShieldAlert,
      content: [
        "Calculated using dev share, insider clustering, and holder distribution",
        "Safe 🟢 (0-30)",
        "Risky 🟡 (31-60)",
        "High Risk 🔴 (61-100)"
      ]
    },
    {
      title: "5️⃣ Bonding Progress",
      icon: Activity,
      content: [
        "Real-time bonding bar",
        "Shows % of bonding completed",
        "Uses on-chain data signals"
      ]
    },
    {
      title: "6️⃣ PumpList",
      icon: TrendingUp,
      content: [
        "List of trending tokens curated by trusted sources",
        "Sorted by votes, volume, and bonding speed"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Hero Section */}
      <div className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-64 bg-[#54d292]/10 blur-3xl rounded-full -translate-y-1/2" />
        <h1 className="text-6xl font-black tracking-tighter mb-4 text-[#54d292] drop-shadow-[0_0_15px_rgba(84,210,146,0.3)]">
          VX Docs
        </h1>
        <p className="text-xl font-medium italic text-muted-foreground max-w-2xl mx-auto">
          Judge tokens before the chart judges you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <Card key={idx} className="bg-zinc-900/50 border-[#54d292]/20 hover:border-[#54d292]/50 transition-all duration-300 rounded-xl group hover-elevate">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <section.icon className="w-6 h-6 text-[#54d292]" />
              <CardTitle className="text-lg font-bold tracking-tight">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.content.map((item, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                    <span className="text-[#54d292] mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        {/* Disclaimer */}
        <Card className="md:col-span-2 bg-zinc-900/50 border-red-500/20 rounded-xl mt-6">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <CardTitle className="text-lg font-bold tracking-tight text-red-500">7️⃣ Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 italic">
              VX is a research and community sentiment tool. Always DYOR.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
