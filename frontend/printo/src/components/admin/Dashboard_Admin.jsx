import React, { useState, useEffect } from "react";
// ShadCN UI components (Button, Card, Avatar, etc.)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Framer Motion for animations
import { motion } from "framer-motion";
// React Icons
import {
  FiUsers,
  FiBox,
  FiSettings,
  FiLogOut,
  FiBarChart2,
} from "react-icons/fi";
import { ChevronDown } from "lucide-react";
// ShadCN UI Select
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
// ShadCN UI Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import adminApi from "@/api/adminApi";

const navItems = [
  { icon: <FiBarChart2 />, label: "Overview" },
  { icon: <FiUsers />, label: "Users" },
  { icon: <FiBox />, label: "Products" },
  { icon: <FiSettings />, label: "Settings" },
];

// Dummy data for orders
const ordersData = {
  day: [12, 18, 9, 15, 22, 8, 13],
  month: [120, 140, 110, 160, 180, 130, 150, 170, 190, 200, 210, 220],
  year: [1200, 1400, 1100, 1600, 1800],
};
const ordersLabels = {
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  month: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  year: ["2020", "2021", "2022", "2023", "2024"],
};

const Dashboard_Admin = () => {
  const [orderFilter, setOrderFilter] = useState("month");
  const orderValues = ordersData[orderFilter];
  const orderLabels = ordersLabels[orderFilter];
  const maxOrder = Math.max(...orderValues);

  // State for real data
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [salesTotal, setSalesTotal] = useState(0);

  useEffect(() => {
    // Fetch users, products, and orders for stats
    const fetchStats = async () => {
      try {
        // Users
        const usersRes = await adminApi.get("/get-all-users");
        setUserCount(usersRes.data.length);

        // Products
        const productsRes = await adminApi.get("/products");
        setProductCount(productsRes.data.length);

        // Orders (for sales)
        const ordersRes = await adminApi.get("/orders");
        // Calculate total sales (sum of all orders' items' price * quantity)
        let total = 0;
        ordersRes.data.forEach((order) => {
          order.items.forEach((item) => {
            if (item.product && typeof item.product.price === "number") {
              total += item.product.price * item.quantity;
            }
          });
        });
        setSalesTotal(total);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors">
      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
              Welcome, Admin
            </h1>
            <p className="text-muted-foreground text-base">
              Here’s an overview of your platform’s activity.
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.5, type: "spring" }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <Card className="hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="rounded-full bg-muted p-2">
                  <FiUsers className="text-blue-500" size={28} />
                </div>
                <CardTitle className="text-lg font-semibold">Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userCount}</div>
                <div className="text-muted-foreground text-sm">
                  Active users registered
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <Card className="hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="rounded-full bg-muted p-2">
                  <FiBox className="text-green-500" size={28} />
                </div>
                <CardTitle className="text-lg font-semibold">
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCount}</div>
                <div className="text-muted-foreground text-sm">
                  Total products listed
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <Card className="hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="rounded-full bg-muted p-2">
                  <FiBarChart2 className="text-purple-500" size={28} />
                </div>
                <CardTitle className="text-lg font-semibold">Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${salesTotal.toLocaleString()}
                </div>
                <div className="text-muted-foreground text-sm">
                  Total revenue (all time)
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Orders Per Month Card */}
        <Card className="w-full max-w-3xl mx-auto mt-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FiBarChart2 className="text-primary" size={22} />
              Orders per{" "}
              {orderFilter.charAt(0).toUpperCase() + orderFilter.slice(1)}
            </CardTitle>
            <Select value={orderFilter} onValueChange={setOrderFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
                <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {/* Simple Bar Chart with Y-axis min/max and ruler */}
            <TooltipProvider>
              <div className="flex flex-row items-end gap-3 h-40 mt-4 relative">
                {/* Y-axis labels and ruler */}
                <div className="flex flex-col justify-between h-full mr-2 py-1 relative">
                  <span className="text-xs text-muted-foreground">
                    {maxOrder}
                  </span>
                  <span className="flex-1 border-l border-border opacity-40 absolute left-1/2 top-0 w-px h-full pointer-events-none" />
                  <span className="text-xs text-muted-foreground mt-auto">
                    {Math.min(...orderValues)}
                  </span>
                </div>
                {/* Bar chart */}
                <div className="flex items-end gap-3 h-full">
                  {orderValues.map((val, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(val / maxOrder) * 100}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                          className="flex flex-col items-center justify-end"
                        >
                          <div
                            className="w-6 sm:w-8 rounded bg-primary/80"
                            style={{ height: `${(val / maxOrder) * 100}%` }}
                          />
                          <span className="text-xs mt-2 text-muted-foreground">
                            {orderLabels[idx]}
                          </span>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <span className="font-medium">{val}</span>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </TooltipProvider>
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <span>Min: {Math.min(...orderValues)}</span>
              <span>Max: {maxOrder}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard_Admin;
