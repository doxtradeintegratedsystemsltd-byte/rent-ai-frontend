"use client";

import { getSidebarLinks } from "./sidebar-links";
import { SidebarItem } from "./sidebar-items";
import Logo from "../ui/logo";
import { Icon } from "@/components/ui/icon";
import { useUserRole, useAuthActions } from "@/store/authStore";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Sidebar() {
  const userRole = useUserRole();
  const { logout } = useAuthActions();
  const router = useRouter();
  const sidebarLinks = getSidebarLinks(userRole);

  // Live date/time state (updates at the start of each minute)
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Calculate ms until next minute to align updates cleanly
    const updateNow = () => setNow(new Date());
    const msToNextMinute = 60000 - (Date.now() % 60000);
    let interval: ReturnType<typeof setInterval> | null = null;
    const timeout = setTimeout(() => {
      updateNow();
      interval = setInterval(updateNow, 60000);
    }, msToNextMinute);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  const timeString = (() => {
    const raw = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }); // e.g. "2:10 PM"
    return raw.replace("AM", "A.M.").replace("PM", "P.M.");
  })();

  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="border-border sticky top-0 flex h-screen w-64 flex-col justify-between border-r px-6 py-4">
      <div className="flex flex-col gap-4">
        <div className="pb-3">
          <Logo dark />
        </div>
        {sidebarLinks.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            exact={
              item.href === (userRole === "superAdmin" ? "/super" : "/admin")
            }
          />
        ))}
      </div>

      <div className="border-border bg-muted flex flex-col gap-4 rounded-md border px-4 py-2">
        <div className="text-muted-foreground border-l-2 border-[#9B9B9B] p-2.5 text-xs font-medium">
          <p>{timeString}</p>
          <p>{dateString}</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="secondary"
          className="border-border bg-background hover:bg-foreground/5 flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium"
        >
          <Icon icon="material-symbols:logout" className="text-[#9B9B9B]" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
