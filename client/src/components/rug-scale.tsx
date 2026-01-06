import { cn } from "@/lib/utils";
import { Gauge, ShieldAlert, ShieldCheck } from "lucide-react";

interface RugScaleProps {
  score: number; // 0-100
  className?: string;
}

export function RugScale({ score, className }: RugScaleProps) {
  // 0-30: Low Risk (Green)
  // 31-70: Medium Risk (Yellow/Orange)
  // 71-100: High Risk (Red)

  let colorClass = "text-yellow-500";
  let label = "Medium Risk";
  let Icon = Gauge;

  if (score <= 30) {
    colorClass = "text-w-green";
    label = "Low Risk";
    Icon = ShieldCheck;
  } else if (score > 70) {
    colorClass = "text-trash-red";
    label = "High Risk";
    Icon = ShieldAlert;
  }

  return (
    <div className={cn("glass-panel p-4 rounded-lg flex items-center justify-between border border-border/50", className)}>
      <div className="flex flex-col">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Rug Scale</span>
        <div className="flex items-center gap-2">
           <Icon className={cn("w-5 h-5", colorClass)} />
           <span className={cn("text-xl font-bold font-mono", colorClass)}>{score}/100</span>
        </div>
      </div>
      
      <div className="text-right">
        <span className={cn("text-sm font-bold block", colorClass)}>{label}</span>
        <span className="text-[10px] text-muted-foreground block max-w-[120px] leading-tight mt-1">
          Based on 12 on-chain signals & community votes
        </span>
      </div>
    </div>
  );
}
