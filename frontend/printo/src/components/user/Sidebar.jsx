import { NavLink } from "react-router-dom";
import { User, Package, Settings, ShoppingCart } from "lucide-react";

const navigationItems = [
  {
    label: "Account",
    href: "/user/account",
    icon: User,
  },
  {
    label: "My Cart",
    href: "/user/cart",
    icon: ShoppingCart,
  },
  {
    label: "Orders",
    href: "/user/orders",
    icon: Package,
  },
  {
    label: "Settings",
    href: "/user/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm rounded-lg p-4">
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            end
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
