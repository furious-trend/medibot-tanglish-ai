import { cn } from "@/lib/utils";

interface AICoreProps {
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const AiCore = ({ isActive = false, size = "md", className }: AICoreProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={cn(
        "ai-core",
        sizeClasses[size],
        isActive && "animate-pulse"
      )}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary-glow to-primary opacity-75 animate-spin" 
             style={{ animationDuration: '3s' }} />
        <div className="absolute inset-2 rounded-full bg-background/20 backdrop-blur-sm" />
        <div className="absolute inset-4 rounded-full bg-primary/30 animate-pulse" />
        
        {/* Inner core */}
        <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary animate-ping" />
      </div>
      
      {/* Orbital rings */}
      <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute inset-2 rounded-full border border-primary/10 animate-spin" 
           style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
    </div>
  );
};

export default AiCore;