import { AlertTriangle, Heart, Shield, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicalAlertProps {
  type: "emergency" | "warning" | "safe" | "info";
  title: string;
  description: string;
  className?: string;
}

const MedicalAlert = ({ type, title, description, className }: MedicalAlertProps) => {
  const alertConfig = {
    emergency: {
      icon: Heart,
      className: "alert-emergency",
      iconColor: "text-emergency"
    },
    warning: {
      icon: AlertTriangle,
      className: "alert-warning",
      iconColor: "text-warning"
    },
    safe: {
      icon: Shield,
      className: "alert-safe",
      iconColor: "text-safe"
    },
    info: {
      icon: Info,
      className: "alert-info",
      iconColor: "text-info"
    }
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "holo-panel p-4 rounded-lg animate-fade-in",
      config.className,
      className
    )}>
      <div className="flex items-start space-x-3">
        <Icon className={cn("w-6 h-6 mt-0.5", config.iconColor)} />
        <div className="flex-1">
          <h4 className="font-orbitron font-semibold text-sm mb-1">{title}</h4>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalAlert;