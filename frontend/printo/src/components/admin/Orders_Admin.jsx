import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FiCheckCircle, FiXCircle, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import adminApi from "@/api/adminApi"; // <-- import adminApi
import axios from "@/lib/axios"; // add this import
import { format } from "date-fns";

const statusColor = {
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Dispatched: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Arriving:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Delivered:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusOptions = [
  "All",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusDisplay = {
  pending: "Pending",
  processing: "Dispatched",
  shipped: "Arriving",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusBadgeClasses = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  processing: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const Orders_Admin = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    // Fetch all orders from backend
    const fetchOrders = async () => {
      try {
        // Adjust endpoint if your backend uses a different route
        const { data } = await adminApi.get("/orders");
        setOrders(data);
      } catch (err) {
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      // Use axios (not adminApi) for PATCH to /orders/:id/status
      await axios.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      // Optionally show error
    }
    setUpdatingId(null);
  };

  const mapStatus = (status) => statusDisplay[status] || "Pending";

  const filteredOrders = orders.filter((order) => {
    const orderId = order._id || order.id || "";
    const displayStatus = mapStatus(order.status);
    const matchesSearch = orderId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All"
        ? true
        : displayStatus === statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        openDropdownId &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId].contains(e.target)
      ) {
        setOpenDropdownId(null);
      }
    };
    if (openDropdownId) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdownId]);

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full shadow-lg border-none bg-card dark:bg-card/80">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 w-full">
            <CardTitle className="text-2xl font-bold tracking-tight mb-2">
              Orders
            </CardTitle>
            <div className="flex flex-row flex-wrap items-center gap-3">
              {["All", ...Object.values(statusDisplay)].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full px-5 py-2 text-xs font-medium transition shadow-none ${
                    status === "All"
                      ? "bg-black text-white hover:bg-neutral-800"
                      : status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : status === "Dispatched"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : status === "Arriving"
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      : status === "Delivered"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : ""
                  } ${statusFilter === status ? "ring-2 ring-accent" : ""}`}
                  style={{ minWidth: 90 }}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
              <div className="relative ml-2 flex items-center">
                {showSearch && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 160, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    placeholder="Search Order ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-1 rounded-full border border-muted bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-accent transition-all ml-2"
                    autoFocus
                  />
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-muted hover:bg-accent transition ml-2"
                  aria-label="Search Orders"
                  onClick={() => setShowSearch((s) => !s)}
                  type="button"
                  style={{ minWidth: 40, minHeight: 40 }}
                >
                  <FiSearch className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, idx) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="border-b border-muted last:border-0 hover:bg-muted/40 transition"
                  >
                    <TableCell className="font-mono">
                      {order._id ? order._id.slice(-6) : ""}
                    </TableCell>
                    <TableCell>
                      {order.user?.name || order.shippingAddress?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {order.createdAt
                        ? format(new Date(order.createdAt), "yyyy-MM-dd")
                        : ""}
                    </TableCell>
                    <TableCell>
                      <div
                        className="relative inline-block"
                        ref={(el) => (dropdownRefs.current[order._id] = el)}
                      >
                        <button
                          type="button"
                          className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold shadow-sm transition-all cursor-pointer focus:outline-none
                            ${
                              statusBadgeClasses[order.status] ||
                              "bg-gray-100 text-gray-800 border-gray-300"
                            }
                            ${
                              order.status === "cancelled"
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                            }
                          `}
                          disabled={
                            updatingId === order._id ||
                            order.status === "cancelled"
                          }
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === order._id ? null : order._id
                            )
                          }
                        >
                          {statusDisplay[order.status]}
                          <span className="ml-2 text-xs">&#9662;</span>
                        </button>
                        {openDropdownId === order._id &&
                          order.status !== "cancelled" && (
                            <div
                              className="absolute z-20 mt-1 right-0 bg-white border rounded shadow-lg flex flex-col"
                            >
                              {["pending", "processing", "shipped", "delivered", "cancelled"]
                                .filter((status) => status !== order.status)
                                .map((status) => (
                                  <button
                                    key={status}
                                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-100 transition
                                      ${statusBadgeClasses[status] || ""}
                                    `}
                                    disabled={updatingId === order._id}
                                    onClick={() => {
                                      setOpenDropdownId(null);
                                      handleStatusChange(order._id, status);
                                    }}
                                  >
                                    {statusDisplay[status]}
                                  </button>
                                ))}
                            </div>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.total != null
                        ? `$${order.total.toFixed(2)}`
                        : "$0.00"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-green-100 dark:hover:bg-green-900 transition"
                        aria-label="Mark as Completed"
                        disabled
                      >
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-red-100 dark:hover:bg-red-900 transition"
                        aria-label="Cancel Order"
                        disabled
                      >
                        <FiXCircle className="w-5 h-5 text-red-600" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Orders_Admin;