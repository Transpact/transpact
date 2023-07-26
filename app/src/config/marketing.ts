import { MarketingConfig } from "@/../types";

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "List",
      href: "/dashboard/lister",
    },
    {
      title: "Bid",
      href: "/dashboard/bidder",
    },
    {
      title: "Features",
      href: "/#features",
    },
    {
      title: "Pricing",
      href: "/pricing",
      disabled: true,
    },
    {
      title: "Blog",
      href: "/blog",
      disabled: true,
    },
    {
      title: "Documentation",
      href: "/docs",
      disabled: true,
    },
  ],
};
