import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VotingBarProps {
  wVotes: number;
  trashVotes: number;
  className?: string;
  size?: "sm" | "lg";
}

export function VotingBar({ wVotes, trashVotes, className, size = "lg" }: VotingBarProps) {
  const total = wVotes + trashVotes;
  const wPercent = total === 0 ? 50 : Math.round((wVotes / total) * 100);
  const trashPercent = 100 - wPercent;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between text-sm font-medium font-mono uppercase tracking-wider mb-1">
        <span className="text-w-green flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-w-green animate-pulse" />
          W ({wPercent}%)
        </span>
        <span className="text-trash-red flex items-center gap-2">
          Trash ({trashPercent}%)
          <span className="inline-block w-2 h-2 rounded-full bg-trash-red animate-pulse" />
        </span>
      </div>
      
      <div className={cn("relative w-full overflow-hidden bg-secondary/50 flex", size === "lg" ? "h-6 rounded-md" : "h-3 rounded-sm")}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${wPercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-w-green h-full relative"
        >
           {/* Diagonal stripe pattern overlay */}
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
        </motion.div>
        
        <div className="w-0.5 h-full bg-background z-10" /> {/* Divider */}
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${trashPercent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="bg-trash-red h-full relative"
        >
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(0,0,0,.15) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.15) 50%,rgba(0,0,0,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
        </motion.div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>{wVotes.toLocaleString()} votes</span>
        <span>{trashVotes.toLocaleString()} votes</span>
      </div>
    </div>
  );
}
