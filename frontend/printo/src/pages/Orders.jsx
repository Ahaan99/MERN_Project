import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders/my-orders");
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Order #{order._id}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(order.createdAt), "PPP")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">${order.totalAmount}</p>
                <span
                  className={`text-sm ${
                    order.status === "delivered"
                      ? "text-green-600"
                      : order.status === "cancelled"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="mt-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 mb-2">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p>{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ${item.product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
