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

  const isActive = href
    ? exact
      ? current === target
      : current === target || current.startsWith(target + "/")
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
