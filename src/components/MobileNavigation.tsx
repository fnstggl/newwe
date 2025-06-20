
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, ShoppingCart, MapPin, DollarSign, FileText } from "lucide-react";

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
      name: "Areas",
      url: "/neighborhoods",
      icon: MapPin,
    },
    {
      name: "Pricing",
      url: "/pricing",
      icon: DollarSign,
    },
    {
      name: "About",
      url: "/manifesto",
      icon: FileText,
    },
  ];

  return <NavBar items={navItems} />;
};

export default MobileNavigation;
