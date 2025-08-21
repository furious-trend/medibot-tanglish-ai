import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, Phone, Calendar } from "lucide-react";
import AiCore from "./ai-core";
import TypingIndicator from "./typing-indicator";
import MedicalAlert from "./medical-alert";
import { cn } from "@/lib/utils";

interface Alert {
  type: "emergency" | "warning" | "safe" | "info";
  title: string;
  description: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  alerts?: Alert[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm Mr.Doctor 👨‍⚕️ Tell me your symptoms and I'll give you quick health tips. English या Tanglish में बात करें!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeSymptoms = (message: string): Alert[] => {
    const lowerMessage = message.toLowerCase();
    const alerts: Alert[] = [];

    if (
      lowerMessage.includes("chest pain") ||
      lowerMessage.includes("breathing") ||
      lowerMessage.includes("severe pain") ||
      lowerMessage.includes("bleeding")
    ) {
      alerts.push({
        type: "emergency",
        title: "🚨 Urgent",
        description:
          "Please seek immediate medical attention or call emergency services.",
      });
    } else if (
      lowerMessage.includes("fever") ||
      lowerMessage.includes("headache") ||
      lowerMessage.includes("nausea") ||
      lowerMessage.includes("pain")
    ) {
      alerts.push({
        type: "warning",
        title: "⚠️ Monitor",
        description:
          "Keep an eye on symptoms. Consult doctor if they worsen.",
      });
    } else if (
      lowerMessage.includes("wellness") ||
      lowerMessage.includes("tips") ||
      lowerMessage.includes("healthy") ||
      lowerMessage.includes("diet")
    ) {
      alerts.push({
        type: "info",
        title: "💡 Health Tip",
        description: "Great question! Preventive care is the best medicine.",
      });
    } else if (
      lowerMessage.includes("cold") ||
      lowerMessage.includes("tired") ||
      lowerMessage.includes("sleep")
    ) {
      alerts.push({
        type: "safe",
        title: "✅ Manageable",
        description:
          "This can usually be managed with home care and rest.",
      });
    }

    return alerts;
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      console.log("Calling Gemini API with message:", userMessage);

      const response = await fetch("/functions/v1/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);
      return data?.response ?? "⚠️ Unexpected API response format.";
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes("fever")) {
        return "🌡️ **Fever Protocol:**\n• Complete bed rest\n• Hydrate: 3-4L water/ORS daily\n• Paracetamol 500mg every 6hrs\n• Light meals (soup, fruits)\n\n⚠️ **See doctor:** >102°F or persists 3+ days";
      }

      if (lowerMessage.includes("headache")) {
        return "🧠 **Headache Relief:**\n• Rest in dark, quiet room\n• Cold compress 15 mins\n• Neck/shoulder massage\n• Hydrate immediately\n\n🚨 **Emergency:** Sudden severe pain, vision changes";
      }

      return "🤖 **Mr.Doctor Ready!**\n\nTell me about:\n• Physical symptoms (fever, headache, cold)\n• Digestive issues (stomach pain, acidity)\n• Lifestyle concerns (sleep, stress, diet)\n\n💡 **Promise:** Quick, actionable advice!";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const alerts = analyzeSymptoms(currentInput);
      const aiResponse = await generateAIResponse(currentInput);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        alerts: alerts.length > 0 ? alerts : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    setIsListening((prev) => !prev);
    // Voice recognition would be implemented here
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="holo-panel p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AiCore size="sm" isActive={isTyping || isListening} />
            <div>
              <h2 className="font-orbitron font-bold text-lg">Mr.Doctor</h2>
              <p className="text-sm text-muted-foreground">
                {isTyping
                  ? "Analyzing..."
                  : isListening
                  ? "Listening..."
                  : "Online"}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="holo-panel">
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
            <Button variant="outline" size="sm" className="holo-panel">
              <Phone className="w-4 h-4 mr-2" />
              Emergency
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3 holo-panel",
                message.sender === "user"
                  ? "bg-primary/20 border-primary/50"
                  : "bg-card/50 border-primary/30"
              )}
            >
              <p className="text-sm">{message.content}</p>

              {/* Alerts */}
              {message.alerts && (
                <div className="mt-3 space-y-2">
                  {message.alerts.map((alert, index) => (
                    <MedicalAlert
                      key={index}
                      type={alert.type}
                      title={alert.title}
                      description={alert.description}
                    />
                  ))}
                </div>
              )}

              <div className="text-xs text-muted-foreground mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="holo-panel bg-card/50 border-primary/30 rounded-lg">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="holo-panel p-4 border-t border-primary/20">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            className={cn(
              "holo-panel",
              isListening && "bg-primary/20 border-primary"
            )}
          >
            <Mic className={cn("w-4 h-4", isListening && "text-primary")} />
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your symptoms... Symptoms சொல்லுங்க..."
            className="flex-1 holo-panel bg-input/50 border-primary/30"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // ✅ FIXED
          />

          <Button
            onClick={handleSendMessage}
            className="holo-panel bg-primary hover:bg-primary-glow"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-center mt-2">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Your conversations are private and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;