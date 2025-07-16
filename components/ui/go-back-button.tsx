"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface GoBackButtonProps {
  className?: string;
  variant?:
    | "ghost"
    | "outline"
    | "default"
    | "secondary"
    | "destructive"
    | "link"
    | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  text?: string;
  icon?: string;
  onClick?: () => void;
}

export const GoBackButton = ({
  className,
  variant = "ghost",
  size = "sm",
  text = "Go Back",
  icon = "material-symbols:arrow-back",
  onClick,
}: GoBackButtonProps) => {
  const { goBack } = useNavigation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      goBack();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(className)}
    >
      <Icon icon={icon} className="mr-2" />
      {text}
    </Button>
  );
};
