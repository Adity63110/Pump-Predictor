import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, AlertTriangle, Fish, User } from "lucide-react";
import { mockService, ChatMessage } from "@/lib/mock-service";
import { cn } from "@/lib/utils";

export function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mockService.getMessages().then(setMessages);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      text: inputValue,
      type: "default",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInputValue("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const getIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'alert-whale': return <Fish className="w-3 h-3 text-blue-400" />;
      case 'alert-dev': return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'alert-lp': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      default: return null;
    }
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
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs font-bold font-mono",
                  msg.user === "You" ? "text-primary" : "text-muted-foreground"
                )}>
                  {msg.user}
                </span>
                <span className="text-[10px] text-muted-foreground/50 font-mono">{msg.timestamp}</span>
                {getIcon(msg.type)}
              </div>
              <p className={cn(
                "text-sm leading-tight",
                msg.type.startsWith('alert') ? "text-yellow-200/90 font-medium" : "text-foreground/90"
              )}>
                {msg.text}
              </p>
            </div>
          ))}
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
        />
        <Button size="icon" variant="secondary" className="h-9 w-9 shrink-0" onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
