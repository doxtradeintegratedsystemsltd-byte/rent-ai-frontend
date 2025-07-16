import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt?: string;
  letter?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  letter,
  size = "md",
  className,
}) => {
  const baseClasses =
    "overflow-hidden rounded-full bg-gray-300 flex items-center justify-center";
  const sizeClass = sizeClasses[size];

  return (
    <div className={cn(baseClasses, sizeClass, className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          width={
            size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 48 : 64
          }
          height={
            size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 48 : 64
          }
        />
      ) : (
        <span className="font-medium text-gray-700 uppercase">
          {letter ? letter.charAt(0) : "?"}
        </span>
      )}
    </div>
  );
};

export default Avatar;
