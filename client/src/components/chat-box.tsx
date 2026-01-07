import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, AlertTriangle, Fish } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Message } from "@shared/schema";

interface ChatBoxProps {
  marketId: string;
}

export function ChatBox({ marketId }: ChatBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/markets", marketId, "messages"],
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      await apiRequest("POST", `/api/markets/${marketId}/messages`, {
        messageText: text,
      });
    },
    onSuccess: () => {
      setInputValue("");
      queryClient.invalidateQueries({ queryKey: ["/api/markets", marketId, "messages"] });
    },
  });

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!inputValue.trim() || mutation.isPending) return;
    mutation.mutate(inputValue);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert-whale': return <Fish className="w-3 h-3 text-blue-400" />;
      case 'alert-dev': return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'alert-lp': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      default: return null;
    }
  };

  const formatTimestamp = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[400px] glass-panel rounded-lg overflow-hidden border border-border/50">
      <div className="p-3 border-b border-border/50 bg-muted/20">
        <h3 className="font-mono text-sm font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Chat
        </h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading && messages.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground animate-pulse">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground">No messages yet. Be the first to chat!</div>
          ) : (
            [...messages].reverse().map((msg) => (
              <div key={msg.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-bold font-mono text-muted-foreground"
                  )}>
                    {msg.voterWallet.slice(0, 6)}...{msg.voterWallet.slice(-4)}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50 font-mono">
                    {formatTimestamp(msg.createdAt)}
                  </span>
                  {getIcon(msg.type)}
                </div>
                <p className={cn(
                  "text-sm leading-tight",
                  msg.type.startsWith('alert') ? "text-yellow-200/90 font-medium" : "text-foreground/90"
                )}>
                  {msg.messageText}
                </p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-border/50 bg-muted/20 flex gap-2">
        <Input 
          className="bg-background/50 border-border/50 text-xs font-mono h-9" 
          placeholder="Type a message..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={mutation.isPending}
        />
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-9 w-9 shrink-0" 
          onClick={handleSend}
          disabled={mutation.isPending || !inputValue.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
