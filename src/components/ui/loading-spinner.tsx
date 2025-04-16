import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary" | "ghost";
  centered?: boolean;
  fullScreen?: boolean;
  text?: string;
}

const sizeClasses = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const variantClasses = {
  default: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  ghost: "text-muted-foreground/50",
};

const LoadingSpinner = ({
  size = "md",
  variant = "default",
  centered = false,
  fullScreen = false,
  text,
  className,
  ...props
}: LoadingSpinnerProps) => {
  const spinner = (
    <div 
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        centered && !fullScreen && "absolute inset-0",
        className
      )}
      {...props}
    >
      <Loader2 
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className={cn(
          "mt-2 text-sm font-medium",
          variantClasses[variant]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (centered && !fullScreen) {
    return (
      <div className="relative h-full w-full min-h-[100px]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export { LoadingSpinner }; 