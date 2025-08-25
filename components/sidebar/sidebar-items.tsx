"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

type SidebarItemProps = {
  title: string;
  href?: string;
  icon: string;
  onClick?: () => void;
  exact?: boolean;
};

export function SidebarItem({
  title,
  href,
  icon,
  onClick,
  exact,
}: SidebarItemProps) {
  const pathname = usePathname();

  // Normalize paths by removing trailing slashes (except root)
  const normalize = (p: string) => (p && p !== "/" ? p.replace(/\/+$/, "") : p);
  const current = normalize(pathname || "");
  const target = href ? normalize(href) : "";

  // Define routes that have their own sidebar items and shouldn't highlight Dashboard
  const sidebarRoutes = ["/payments"];

  // Check if current path matches any sidebar route
  const isCurrentPathASidebarRoute = sidebarRoutes.some((route) => {
    const baseRoute = target.includes("/super") ? "/super" : "/admin";
    const fullRoute = `${baseRoute}${route}`;
    return current === fullRoute || current.startsWith(fullRoute + "/");
  });

  const isActive = href
    ? exact
      ? // When exact is true, check if it's an exact match OR
        // if it's a dashboard route (/admin or /super) and current starts with it
        // BUT exclude if current path is a sidebar route
        current === target ||
        ((target === "/admin" || target === "/super") &&
          current.startsWith(target + "/") &&
          !isCurrentPathASidebarRoute)
      : // When exact is false, use prefix matching
        current === target || current.startsWith(target + "/")
    : false;

  const className = cn(
    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium",
    isActive
      ? "text-background bg-foreground hover:bg-foreground/80"
      : "hover:bg-foreground/10",
  );

  const IconComp = <Icon icon={icon} />;

  if (href) {
    return (
      <Link href={href} className={className}>
        {IconComp}
        <span>{title}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {IconComp}
      <span>{title}</span>
    </button>
  );
}
