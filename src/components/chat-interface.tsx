import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, Phone, Calendar, AlertCircle } from "lucide-react";
import AiCore from "./ai-core";
import TypingIndicator from "./typing-indicator";
import MedicalAlert from "./medical-alert";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  alerts?: Array<{
    type: "emergency" | "warning" | "safe";
    title: string;
    description: string;
  }>;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Mr.Doctor, your AI-powered health assistant. How can I help you today? நான் உங்கள் medical questions-க்கு answer பண்ணுவேன்.",
      sender: "ai",
      timestamp: new Date()
    }
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

  const analyzeSymptoms = (message: string): Array<{ type: "emergency" | "warning" | "safe"; title: string; description: string; }> => {
    const lowerMessage = message.toLowerCase();
    const alerts = [];

    // Emergency symptoms
    if (lowerMessage.includes("chest pain") || lowerMessage.includes("difficulty breathing") || 
        lowerMessage.includes("severe headache") || lowerMessage.includes("unconscious")) {
      alerts.push({
        type: "emergency" as const,
        title: "Emergency Alert",
        description: "Your symptoms may require immediate medical attention. Please consider visiting an emergency room or calling emergency services."
      });
    }
    
    // Warning symptoms
    else if (lowerMessage.includes("fever") || lowerMessage.includes("headache") || 
             lowerMessage.includes("nausea") || lowerMessage.includes("fatigue")) {
      alerts.push({
        type: "warning" as const,
        title: "Monitor Symptoms",
        description: "Please monitor these symptoms. Consider consulting a healthcare provider if they worsen or persist."
      });
    }
    
    // Safe/general health
    else if (lowerMessage.includes("wellness") || lowerMessage.includes("prevention") || 
             lowerMessage.includes("healthy")) {
      alerts.push({
        type: "safe" as const,
        title: "Health Guidance",
        description: "Great that you're focused on maintaining good health! I can provide general wellness tips."
      });
    }

    return alerts;
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if message contains Tamil/Tanglish
    const hasTamil = /[அ-ஹ]/.test(userMessage) || 
                     userMessage.includes("en") || userMessage.includes("la") || 
                     userMessage.includes("ku") || userMessage.includes("da");
    
    if (lowerMessage.includes("fever")) {
      return hasTamil ? 
        "Fever-ku நீங்க rest எடுக்கணும். Plenty of fluids குடிங்க, paracetamol tablet take பண்ணலாம். If temperature 102°F மேல போனா doctor-ஐ consult பண்ணுங்க." :
        "For fever, please get adequate rest and drink plenty of fluids. You can take paracetamol as directed. If temperature exceeds 102°F or persists for more than 3 days, please consult a healthcare provider.";
    }
    
    if (lowerMessage.includes("headache")) {
      return hasTamil ?
        "Headache-ku first நீங்க rest எடுக்கணும். Enough water குடிங்க, stress avoid பண்ணுங்க. If severe pain-னா doctor கிட்ட போங்க." :
        "For headaches, ensure you're well-rested and hydrated. Avoid stress and screen time. If pain is severe or accompanied by other symptoms, please seek medical attention.";
    }
    
    return hasTamil ?
      "உங்க symptoms பத்தி கொஞ்சம் more details சொல்லுங்க. நான் better guidance தர முடியும். Remember, serious symptoms-னா doctor கிட்ட போகணும்." :
      "Please provide more details about your symptoms so I can offer better guidance. Remember, for serious symptoms, always consult with a healthcare professional.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const alerts = analyzeSymptoms(inputValue);
      const aiResponse = generateAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        alerts: alerts.length > 0 ? alerts : undefined
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
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
                {isTyping ? "Analyzing..." : isListening ? "Listening..." : "Online"}
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
          <div key={message.id} className={cn(
            "flex",
            message.sender === "user" ? "justify-end" : "justify-start"
          )}>
            <div className={cn(
              "max-w-[80%] rounded-lg p-3 holo-panel",
              message.sender === "user" 
                ? "bg-primary/20 border-primary/50" 
                : "bg-card/50 border-primary/30"
            )}>
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
            placeholder="Describe your symptoms... உங்க symptoms சொல்லுங்க..."
            className="flex-1 holo-panel bg-input/50 border-primary/30"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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