import * as React from "react";
import NextLink from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const linkVariants = cva(
  "text-primary underline-offset-4 hover:underline transition-all duration-300 ease-in-out font-medium",
  {
    variants: {
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        secondary: "text-secondary-foreground",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LinkProps
  extends React.ComponentProps<typeof NextLink>,
    VariantProps<typeof linkVariants> {
  className?: string;
}

const Link = React.forwardRef<React.ElementRef<typeof NextLink>, LinkProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <NextLink
        className={cn(linkVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Link.displayName = "Link";

export { Link, linkVariants };
