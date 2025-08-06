import type { UserType } from "@/types/user";

type SidebarLink = {
  title: string;
  href: string;
  icon: string;
};

export const getSidebarLinks = (userRole: UserType | null): SidebarLink[] => {
  const baseRoute = userRole === "superAdmin" ? "/super" : "/admin";

  return [
    {
      title: "Dashboard",
      href: baseRoute,
      icon: "material-symbols:home-app-logo",
    },
    {
      title: "Payments",
      href: `${baseRoute}/payments`,
      icon: "material-symbols:contract",
    },
  ];
};

// Legacy export for backward compatibility (if needed)
export const mainLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "material-symbols:home-app-logo",
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: "material-symbols:contract",
  },
];
