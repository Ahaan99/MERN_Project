import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import axios from "@/lib/axios";

const Orders_User = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/orders");
      setOrders(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const statusDisplay = {
    pending: "Pending",
    processing: "Dispatched",
    shipped: "Arriving",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const getOrderStatus = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      processing: "bg-blue-100 text-blue-800 border-blue-300",
      shipped: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold shadow-sm transition-all
          ${
            statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-300"
          }
        `}
      >
        {statusDisplay[status] ||
          (status ? status.charAt(0).toUpperCase() + status.slice(1) : "")}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      await axios.patch(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      toast.success("Order cancelled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
    setCancellingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>View and track your orders</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                You haven't placed any orders yet.
              </p>{" "}
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => navigate("/products")}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      #{order._id.slice(-6)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{formatPrice(order.total)}</TableCell>
                    <TableCell>{getOrderStatus(order.status)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                              Order #{order._id.slice(-6)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 space-y-6">
                            {/* Order Status */}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">Status</p>
                                <div className="mt-1">
                                  {getOrderStatus(order.status)}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  Order Date
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {format(
                                    new Date(order.createdAt),
                                    "MMMM d, yyyy"
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <h4 className="text-sm font-medium">
                                Shipping Address
                              </h4>
                              <address className="mt-1 text-sm text-gray-500 not-italic">
                                {order.shippingAddress.name}
                                <br />
                                {order.shippingAddress.address}
                                <br />
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.state}{" "}
                                {order.shippingAddress.pincode}
                                <br />
                                {order.shippingAddress.phone}
                                {order.shippingAddress.email && (
                                  <>
                                    <br />
                                    {order.shippingAddress.email}
                                  </>
                                )}
                              </address>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Order Items
                              </h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item._id}>
                                      <TableCell>
                                        <div className="flex items-center gap-3">
                                          <img
                                            src={
                                              item.product &&
                                              item.product.images &&
                                              item.product.images.length > 0
                                                ? item.product.images[0].url
                                                : "https://via.placeholder.com/60x60?text=No+Image"
                                            }
                                            alt={
                                              item.product
                                                ? item.product.name
                                                : "No product"
                                            }
                                            className="w-12 h-12 rounded object-cover"
                                          />
                                          <div>
                                            <p className="font-medium">
                                              {item.product
                                                ? item.product.name
                                                : "Product not found"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                              Size: {item.size}, Color:{" "}
                                              {item.color}
                                            </p>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>
                                        {formatPrice(item.price)}
                                      </TableCell>
                                      <TableCell>
                                        {formatPrice(
                                          item.price * item.quantity
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Subtotal</span>
                                  <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Shipping</span>
                                  <span>{formatPrice(order.shippingCost)}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatPrice(order.discount)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-medium">
                                  <span>Total</span>
                                  <span>{formatPrice(order.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {/* Cancel Order Button */}
                      {order.status !== "delivered" &&
                        order.status !== "cancelled" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="ml-2"
                            disabled={cancellingId === order._id}
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            {cancellingId === order._id
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders_User;
