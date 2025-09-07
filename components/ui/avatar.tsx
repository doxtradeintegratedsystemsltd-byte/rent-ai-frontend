import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  letter?: string;
  name?: string;
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
  name,
  size = "md",
  className,
}) => {
  const baseClasses =
    "overflow-hidden rounded-full flex items-center justify-center";
  const sizeClass = sizeClasses[size];
  const hasImage = Boolean(src);
  const containerClasses = cn(
    baseClasses,
    sizeClass,
    hasImage ? "bg-background" : "bg-muted ring-1 ring-border text-foreground",
    className,
  );

  // Function to generate initials from a name
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(/\s+/);
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Determine what to display
  const getDisplayContent = () => {
    if (src) {
      return (
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
      );
    }

    let displayText = "?";
    if (name) {
      displayText = getInitials(name);
    } else if (letter) {
      displayText = letter.charAt(0).toUpperCase();
    }

    return <span className="font-semibold uppercase">{displayText}</span>;
  };

  return (
    <div className={containerClasses} aria-label={name || letter || alt}>
      {getDisplayContent()}
    </div>
  );
};

export default Avatar;
