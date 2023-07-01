import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/",
    },
    {
      title: "Support",
      href: "/",
      disabled: true,
    },
  ],
  sidebarNav: [
    // {
    //   title: "All Contracts",
    //   href: "/dashboard/lister",
    //   icon: "dashboard",
    // },

    {
      title: "My Contracts",
      href: "/dashboard/lister",
      icon: "users",
    },
    {
      title: "Add Contract",
      href: "/contract/add",
      icon: "package",
    },

    // {
    //   title: "Invoices",
    //   href: "/dashboard/invoices",
    //   icon: "billing",
    //   disabled: true,
    // },
    // {
    //   title: "Reports",
    //   href: "/dashboard/reports",
    //   icon: "post",
    //   disabled: true,
    // },

    // {
    //   title: "Profile",
    //   href: "/dashboard/profile",
    //   icon: "settings",
    //   disabled: true,
    // },
    // {
    //   title: "Upgrade to Plus",
    //   href: "/dashboard/billing",
    //   icon: "settings",
    //   disabled: true,
    // },
  ],
};
