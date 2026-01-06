import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2 } from "lucide-react";

export default function AIAnalyser() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center gap-3">
          <BrainCircuit className="h-10 w-10 text-primary" />
          AI Analyser
        </h1>
        <p className="text-xl text-muted-foreground">
          Advanced token analysis powered by artificial intelligence.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span>Scanning markets...</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/50 text-muted-foreground italic text-center px-4">
              Select a token from the markets to view AI-generated sentiment analysis.
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg">Contract Safety</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/50 text-muted-foreground">
              Awaiting token selection...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
