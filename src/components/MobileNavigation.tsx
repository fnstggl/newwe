
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, ShoppingCart, Bookmark, DollarSign, FileText } from "lucide-react";

const MobileNavigation = () => {
  const navItems = [
    {
      name: "Buy",
      url: "/buy",
      icon: Home,
    },
    {
      name: "Rent",
      url: "/rent",
      icon: ShoppingCart,
    },
    {
      name: "Saved",
      url: "/saved",
      icon: Bookmark,
    },
    {
      name: "Pricing",
      url: "/pricing",
      icon: DollarSign,
    },
    {
      name: "Mission",
      url: "/mission",
      icon: FileText,
    },
  ];

  return <NavBar items={navItems} />;
};

export default MobileNavigation;
