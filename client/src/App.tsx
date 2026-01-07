import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import TokenRoom from "@/pages/token-room";
import AIAnalyser from "@/pages/ai-analyser";
import PumpList from "@/pages/pumplist";
import DocsPage from "@/pages/docs";
import { Navbar } from "@/components/navbar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/room/:id" component={TokenRoom}/>
      <Route path="/ai-analyser" component={AIAnalyser} />
      <Route path="/pumplist" component={PumpList} />
      <Route path="/docs" component={DocsPage} />
      <Route path="/markets" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
