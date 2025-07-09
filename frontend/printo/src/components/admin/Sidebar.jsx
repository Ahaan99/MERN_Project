import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaTshirt,
  FaCog,
  FaSignOutAlt,
  FaClipboardList,
  FaPaintBrush,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import authApi from "@/api/authApi";

const navLinks = [
  { icon: <FaTachometerAlt />, label: "Dashboard", href: "/admin/dashboard" },
  { icon: <FaUsers />, label: "Users", href: "/admin/users" },
  { icon: <FaTshirt />, label: "Products", href: "/admin/products" },
  {
    icon: <FaPaintBrush />,
    label: "Customizable",
    href: "/admin/customizable-products",
  },
  { icon: <FaClipboardList />, label: "Orders", href: "/admin/orders" },
  { icon: <FaCog />, label: "Settings", href: "/admin/settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await authApi.post("/logout");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <aside className="w-64 flex flex-col rounded-r-3xl overflow-hidden">
      <div className="flex flex-col items-center justify-center h-28 gap-2 border-gray-700">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold">P</span>
        </div>
        <span className="text-lg font-semibold tracking-wide">
          Printo Admin
        </span>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-8 px-4">
        {navLinks.map((link, idx) => (
          <Button
            key={link.label}
            variant="ghost"
            className="justify-start w-full text-base font-medium transition flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-primary/60"
            asChild
          >
            <Link to={link.href}>
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="mt-auto px-4 py-2">
        <Separator className="bg-gray-700 my-2" />
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 transition flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500"
          onClick={handleLogout}
        >
          <span className="text-lg">
            <FaSignOutAlt />
          </span>
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
