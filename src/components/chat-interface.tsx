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
    type: "emergency" | "warning" | "safe" | "info";
    title: string;
    description: string;
  }>;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm Mr.Doctor 👨‍⚕️ Tell me your symptoms and I'll give you quick health tips. English या Tanglish में बात करें!",
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

  const analyzeSymptoms = (message: string): Array<{ type: "emergency" | "warning" | "safe" | "info"; title: string; description: string; }> => {
    const lowerMessage = message.toLowerCase();
    const alerts = [];

    // Emergency symptoms
    if (lowerMessage.includes("chest pain") || lowerMessage.includes("breathing") || 
        lowerMessage.includes("severe pain") || lowerMessage.includes("bleeding")) {
      alerts.push({
        type: "emergency" as const,
        title: "🚨 Urgent",
        description: "Please seek immediate medical attention or call emergency services."
      });
    }
    
    // Warning symptoms
    else if (lowerMessage.includes("fever") || lowerMessage.includes("headache") || 
             lowerMessage.includes("nausea") || lowerMessage.includes("pain")) {
      alerts.push({
        type: "warning" as const,
        title: "⚠️ Monitor",
        description: "Keep an eye on symptoms. Consult doctor if they worsen."
      });
    }
    
    // General health queries
    else if (lowerMessage.includes("wellness") || lowerMessage.includes("tips") || 
             lowerMessage.includes("healthy") || lowerMessage.includes("diet")) {
      alerts.push({
        type: "info" as const,
        title: "💡 Health Tip",
        description: "Great question! Preventive care is the best medicine."
      });
    }
    
    // Safe/mild symptoms
    else if (lowerMessage.includes("cold") || lowerMessage.includes("tired") || 
             lowerMessage.includes("sleep")) {
      alerts.push({
        type: "safe" as const,
        title: "✅ Manageable",
        description: "This can usually be managed with home care and rest."
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
    
    // Fever responses
    if (lowerMessage.includes("fever")) {
      return hasTamil ? 
        "🌡️ **Fever Management:**\n• Rest & sleep 8+ hours\n• Water/ORS - 3-4 liters daily\n• Paracetamol 500mg (6 hours gap)\n• Light food only\n\n⚠️ Doctor-ku போங்க if 102°F+ or 3 days+" :
        "🌡️ **Fever Protocol:**\n• Complete bed rest\n• Hydrate: 3-4L water/ORS daily\n• Paracetamol 500mg every 6hrs\n• Light meals (soup, fruits)\n\n⚠️ **See doctor:** >102°F or persists 3+ days";
    }
    
    // Headache responses
    if (lowerMessage.includes("headache")) {
      return hasTamil ?
        "🧠 **Headache Relief:**\n• Dark room-la rest\n• Ice pack - 15 mins\n• Neck/shoulder massage\n• Water 2-3 glasses\n\n🚨 Severe pain-னா immediately doctor!" :
        "🧠 **Headache Relief:**\n• Rest in dark, quiet room\n• Cold compress 15 mins\n• Neck/shoulder massage\n• Hydrate immediately\n\n🚨 **Emergency:** Sudden severe pain, vision changes";
    }
    
    // Cold/Cough responses
    if (lowerMessage.includes("cold") || lowerMessage.includes("cough")) {
      return hasTamil ?
        "🤧 **Cold/Cough Care:**\n• Warm water gargle (salt)\n• Honey + ginger tea\n• Steam inhale 10 mins\n• Vitamin C foods\n\n✅ 5-7 days-la resolve ஆகும்" :
        "🤧 **Cold/Cough Protocol:**\n• Salt water gargle 3x daily\n• Honey-ginger tea (warm)\n• Steam inhalation 10 mins\n• Increase Vitamin C intake\n\n✅ **Recovery:** 5-7 days typically";
    }
    
    // Stomach issues
    if (lowerMessage.includes("stomach") || lowerMessage.includes("pain") || lowerMessage.includes("acidity")) {
      return hasTamil ?
        "🫃 **Stomach Issues:**\n• Light food (rice, curd)\n• ORS/coconut water\n• Avoid spicy/oily\n• Small frequent meals\n\n⚠️ Severe pain-னா doctor!" :
        "🫃 **Stomach Care:**\n• BRAT diet (banana, rice, toast)\n• Stay hydrated (ORS/coconut water)\n• Avoid spicy/oily foods\n• Small, frequent meals\n\n⚠️ **See doctor:** Severe/persistent pain";
    }
    
    // Diet/Nutrition responses
    if (lowerMessage.includes("diet") || lowerMessage.includes("nutrition") || lowerMessage.includes("weight")) {
      return hasTamil ?
        "🥗 **Healthy Diet Plan:**\n• Breakfast: Oats/fruits\n• Lunch: Balanced plate\n• Dinner: Light (8pm before)\n• Water: 8-10 glasses\n\n💪 Exercise 30 mins daily" :
        "🥗 **Nutrition Guide:**\n• Balanced plate: 50% veggies, 25% protein, 25% carbs\n• 5-6 small meals daily\n• 8-10 glasses water\n• Limit processed foods\n\n💪 **Exercise:** 30 mins daily minimum";
    }
    
    // Sleep issues
    if (lowerMessage.includes("sleep") || lowerMessage.includes("tired") || lowerMessage.includes("fatigue")) {
      return hasTamil ?
        "😴 **Better Sleep:**\n• 10:30pm-ku bed\n• Phone avoid 1 hour before\n• Room dark & cool\n• Warm milk/chamomile\n\n⭐ 7-8 hours必須" :
        "😴 **Sleep Optimization:**\n• Sleep by 10:30 PM\n• No screens 1hr before bed\n• Cool, dark room\n• Warm milk or chamomile tea\n\n⭐ **Target:** 7-8 hours nightly";
    }
    
    // Stress/Mental health
    if (lowerMessage.includes("stress") || lowerMessage.includes("anxiety") || lowerMessage.includes("mental")) {
      return hasTamil ?
        "🧘 **Stress Management:**\n• Deep breathing 5 mins\n• Walking outdoors\n• Talk to family/friends\n• Music/meditation\n\n💚 Professional help-um okay!" :
        "🧘 **Stress Relief:**\n• Practice deep breathing (5 mins)\n• Daily outdoor walks\n• Connect with loved ones\n• Meditation/music therapy\n\n💚 **Remember:** Seeking help is strength!";
    }
    
    // General wellness
    if (lowerMessage.includes("wellness") || lowerMessage.includes("tips") || lowerMessage.includes("healthy")) {
      return hasTamil ?
        "✨ **Daily Wellness:**\n• Morning sunlight 15 mins\n• Walk 10,000 steps\n• Meditation 10 mins\n• 8 hours sleep\n\n🌟 Small changes, big results!" :
        "✨ **Daily Wellness Routine:**\n• Morning sunlight exposure (15 mins)\n• 10,000 steps daily\n• 10-minute meditation\n• Consistent sleep schedule\n\n🌟 **Key:** Consistency over perfection!";
    }
    
    // Default response
    return hasTamil ?
      "🤖 **Mr.Doctor Ready!**\n\nSpecific symptoms சொல்லுங்க:\n• Fever, headache, cold\n• Stomach pain, acidity\n• Sleep, stress, diet\n\n💡 Better suggestions கிடைக்கும்!" :
      "🤖 **Mr.Doctor Ready!**\n\nTell me about:\n• Physical symptoms (fever, headache, cold)\n• Digestive issues (stomach pain, acidity)\n• Lifestyle concerns (sleep, stress, diet)\n\n💡 **Promise:** Quick, actionable advice!";
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
            placeholder="Type your symptoms... Symptoms சொல்லுங்க..."
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