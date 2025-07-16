"use client";

import { mainLinks, bottomLinks } from "./sidebar-links";
import { SidebarItem } from "./sidebar-items";
import Logo from "../ui/logo";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

export function Sidebar() {
  return (
    <aside className="border-border sticky top-0 flex h-screen w-64 flex-col justify-between border-r px-6 py-4">
      <div className="flex flex-col gap-4">
        <div className="pb-3">
          <Logo dark />
        </div>
        {mainLinks.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </div>

      <div className="space-y-2 pt-6">
        {/* {bottomLinks.map((item) =>
          item.action === "logout" ? (
            <SidebarItem key={item.title} title={item.title} icon={item.icon} />
          ) : null,
        )} */}
        <Link
          href="/"
          className="border-border bg-muted hover:bg-muted/50 flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium"
        >
          <Icon
            icon="material-symbols:account-circle-outline"
            className="h-5 w-5"
          />
          User Profile
          <Icon
            icon="material-symbols:keyboard-arrow-right"
            className="ml-auto h-5 w-5"
          />
        </Link>
        <div className="border-border bg-muted flex flex-col gap-4 rounded-md border px-4 py-2">
          <div className="text-muted-foreground border-l-2 border-[#9B9B9B] p-2.5 text-xs font-medium">
            <p>2:10 P.M.</p>
            <p>Tuesday, February 5, 2025</p>
          </div>
          <Link
            href="/"
            className="border-border bg-background hover:bg-foreground/5 flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium"
          >
            <Icon
              icon="material-symbols:logout"
              className="h-5 w-5 text-[#9B9B9B]"
            />
            Logout
          </Link>
        </div>
      </div>
    </aside>
  );
}
