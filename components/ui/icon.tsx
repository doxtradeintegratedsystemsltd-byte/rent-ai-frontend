import { Icon as IconifyIcon } from "@iconify-icon/react";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon = ({
  icon,
  className,
  style,
  size = "md",
  ...props
}: IconProps) => {
  const iconSize = typeof size === "number" ? size : sizeMap[size];

  return (
    <IconifyIcon
      icon={icon}
      className={cn("inline-block align-middle", className)}
      style={{
        fontSize: `${iconSize}px`,
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        verticalAlign: "middle",
        ...style,
      }}
      {...props}
    />
  );
};
