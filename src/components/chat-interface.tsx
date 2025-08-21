import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [alerts, setAlerts] = useState<
    {
      type: "emergency" | "warning" | "safe" | "info";
      title: string;
      description: string;
    }[]
  >([]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

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
  };

  const fetchAIResponse = async (input: string): Promise<string> => {
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      return data?.response ?? "Sorry, I couldn't process your request.";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, I couldn't connect to the server.";
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
              className="bg-primary hover:bg-primary/80"
            >
              Send
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
