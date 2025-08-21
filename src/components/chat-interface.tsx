import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Activity, CheckCircle, Info } from "lucide-react";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; text: string }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<
    {
      type: "emergency" | "warning" | "safe" | "info";
      title: string;
      description: string;
    }[]
  >([]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    // User message
    const userMessage = { type: "user" as const, text: inputValue };
    setMessages((prev) => [...prev, userMessage]);

    // Analyze symptoms
    const newAlerts = analyzeSymptoms(inputValue);
    setAlerts(newAlerts);

    // Call AI
    const aiResponse = await fetchAIResponse(inputValue);
    const botMessage = { type: "bot" as const, text: aiResponse };
    setMessages((prev) => [...prev, botMessage]);

    setInputValue("");
    setIsLoading(false);
  };

  const fetchAIResponse = async (input: string): Promise<string> => {
    try {
      console.log("🔄 Sending message to AI:", input);
      
      // Use Supabase Edge Function endpoint
      const response = await fetch("/functions/v1/gemini-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", response.status, errorText);
        
        toast({
          title: "API Connection Error",
          description: `Failed to connect to AI service (${response.status}). Please ensure Supabase is connected and Gemini API key is set.`,
          variant: "destructive",
        });
        
        return `⚠️ Connection Error: Unable to reach AI service (Status: ${response.status}). Please check if Supabase is connected and API keys are configured.`;
      }

      const data = await response.json();
      console.log("✅ AI Response received:", data);
      
      return data?.response ?? "Sorry, I couldn't process your request.";
    } catch (error) {
      console.error("❌ Network Error:", error);
      
      toast({
        title: "Network Error",
        description: "Unable to connect to the AI service. Please check your connection.",
        variant: "destructive",
      });
      
      return `🔌 Network Error: ${error instanceof Error ? error.message : 'Unable to connect to AI service'}`;
    }
  };

  const analyzeSymptoms = (text: string) => {
    const alerts: {
      type: "emergency" | "warning" | "safe" | "info";
      title: string;
      description: string;
    }[] = [];

    const emergencyKeywords = ["chest pain", "severe", "unconscious"];
    const warningKeywords = ["fever", "cough", "headache"];
    const safeKeywords = ["mild", "slight", "normal"];

    if (emergencyKeywords.some((word) => text.toLowerCase().includes(word))) {
      alerts.push({
        type: "emergency",
        title: "🚨 Emergency",
        description:
          "Please seek immediate medical attention or call emergency services.",
      });
    } else if (warningKeywords.some((word) => text.toLowerCase().includes(word))) {
      alerts.push({
        type: "warning",
        title: "⚠️ Warning",
        description:
          "Your symptoms may require attention. Consider consulting a doctor.",
      });
    } else if (safeKeywords.some((word) => text.toLowerCase().includes(word))) {
      alerts.push({
        type: "safe",
        title: "✅ Safe",
        description: "Your symptoms seem mild. Monitor and rest.",
      });
    } else {
      alerts.push({
        type: "info",
        title: "ℹ️ Info",
        description:
          "Please provide more details about your symptoms for better analysis.",
      });
    }

    return alerts;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Card className="flex-1 m-4 border-2 border-primary shadow-lg rounded-2xl overflow-hidden bg-background/90 backdrop-blur">
        <CardHeader className="bg-primary/20 border-b border-primary">
          <CardTitle className="text-center text-xl font-bold text-primary">
            🩺 Mr. Doctor – AI Health Consultant
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-full">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4 space-y-3 rounded-lg bg-black/20 border border-white/10 mb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs ${
                    msg.type === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-muted text-white rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </ScrollArea>

          {/* Alerts */}
          <div className="space-y-2 mb-4">
            {alerts.map((alert, i) => (
              <Alert
                key={i}
                variant={
                  alert.type === "emergency"
                    ? "destructive"
                    : alert.type === "warning"
                    ? "default"
                    : alert.type === "safe"
                    ? "default"
                    : "default"
                }
                className={`border-2 ${
                  alert.type === "emergency"
                    ? "border-red-500"
                    : alert.type === "warning"
                    ? "border-yellow-500"
                    : alert.type === "safe"
                    ? "border-green-500"
                    : "border-blue-500"
                }`}
              >
                {alert.type === "emergency" ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : alert.type === "warning" ? (
                  <Activity className="h-5 w-5 text-yellow-500" />
                ) : alert.type === "safe" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Info className="h-5 w-5 text-blue-500" />
                )}

                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your symptoms... Symptoms சொல்லுங்க..."
              className="flex-1 holo-panel bg-input/50 border-primary/30"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // ✅ fixed
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/80 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ✅ Default export (for `import ChatInterface from ...`)
export default ChatInterface;

// ✅ Named export (for `import { ChatInterface } from ...`)
export { ChatInterface };
