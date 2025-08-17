import ParticlesBackground from "@/components/ui/particles-background";
import AiCore from "@/components/ai-core";
import ChatInterface from "@/components/chat-interface";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Zap, Globe } from "lucide-react";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="min-h-screen bg-background relative">
        <ParticlesBackground />
        <div className="container mx-auto h-screen p-4">
          <div className="h-full max-w-4xl mx-auto">
            <ChatInterface />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* AI Core Animation */}
          <div className="flex justify-center mb-8">
            <AiCore size="lg" isActive={true} />
          </div>
          
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="font-orbitron text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Mr.Doctor
            </h1>
            <p className="font-orbitron text-xl md:text-2xl text-primary-glow">
              Your AI-Powered Health Assistant
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced medical AI that understands both English and Tamil. 
              Get instant symptom analysis, health guidance, and emergency alerts 
              in your preferred language.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="holo-panel p-6 text-center space-y-3">
              <Globe className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-orbitron font-semibold">Bilingual Support</h3>
              <p className="text-sm text-muted-foreground">
                Responds in English or Tanglish based on your input
              </p>
            </div>
            
            <div className="holo-panel p-6 text-center space-y-3">
              <Zap className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-orbitron font-semibold">Instant Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Real-time symptom analysis with smart alerts
              </p>
            </div>
            
            <div className="holo-panel p-6 text-center space-y-3">
              <Shield className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-orbitron font-semibold">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your health data is encrypted and protected
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Button 
              onClick={() => setShowChat(true)}
              size="lg"
              className="bg-primary hover:bg-primary-glow text-primary-foreground font-orbitron font-semibold px-8 py-4 text-lg holo-panel"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Health Consultation
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 holo-panel bg-warning/10 border border-warning/30 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-warning-foreground">
              <strong>Medical Disclaimer:</strong> Mr.Doctor provides general health information only. 
              Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
