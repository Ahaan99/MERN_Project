import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCreditCard, FaPaypal, FaApplePay } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import userApi from "@/api/userApi";
import { useCartStore } from "@/stores/cartStore";
import productApi from "@/api/productApi";

const paymentMethods = [
  {
    name: "Credit Card",
    icon: <FaCreditCard className="text-xl text-blue-600 dark:text-blue-400" />,
    value: "card",
  },
  {
    name: "PayPal",
    icon: <FaPaypal className="text-xl text-blue-500 dark:text-blue-300" />,
    value: "paypal",
  },
  {
    name: "Apple Pay",
    icon: <FaApplePay className="text-xl text-gray-800 dark:text-gray-200" />,
    value: "applepay",
  },
];

const PaymentMethodOption = ({ method, selected, onSelect }) => (
  <Button
    type="button"
    variant="outline"
    onClick={() => onSelect(method.value)}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border transition
      ${
        selected === method.value
          ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
      }
      focus:outline-none focus:ring-2 focus:ring-blue-400`}
  >
    {method.icon}
    <span className="font-medium">{method.name}</span>
    {selected === method.value && (
      <span className="ml-auto text-blue-600 dark:text-blue-400 font-semibold text-xs">
        Selected
      </span>
    )}
  </Button>
);

const Payment = () => {
  const {
    cartItems,
    shippingAddress: savedShippingAddress,
    clearCart: clearAuthCart,
    user,
  } = useAuth();
  const clearCartStore = useCartStore((state) => state.clearCart);
  const [selectedMethod, setSelectedMethod] = React.useState("card");
  const [loading, setLoading] = React.useState(false);
  const [expiry, setExpiry] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const navigate = useNavigate();

  // Shipping address state (editable by user)
  const [shippingAddress, setShippingAddress] = React.useState({
    name: savedShippingAddress?.name || "",
    email: savedShippingAddress?.email || "",
    phone: savedShippingAddress?.phone || "",
    address: savedShippingAddress?.address || "",
    city: savedShippingAddress?.city || "",
    state: savedShippingAddress?.state || "",
    pincode: savedShippingAddress?.pincode || "",
  });

  // Animate card entrance
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order payload
      const items = cartItems.map((item) => ({
        product: item.product._id || item.product,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        customization: item.customization || null,
      }));

      // Call backend to create order
      const response = await axios.post(
        "/orders",
        {
          items,
          shippingAddress,
        },
        { withCredentials: true }
      );
      console.log("Order creation response:", response.data);

      // Clear cart in backend
      await productApi.post(`/${user._id}/clear-cart`);

      // Clear frontend cart stores
      clearAuthCart();
      clearCartStore();

      toast.success("Order placed successfully!");
      setTimeout(() => {
        setLoading(false);
        navigate("/user/orders");
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  // Handle expiry input with auto "/"
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    setExpiry(value);
  };

  // Handle card number input with auto space every 4 digits
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  // Handle shipping address input change
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-8 px-2">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <Card className="shadow-xl border-0 dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Securely complete your purchase
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Shipping Address Form */}
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 mb-2">
                <div className="font-semibold mb-1 text-gray-700 dark:text-gray-200">
                  Shipping Address
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="shipping-name">Name</Label>
                    <Input
                      id="shipping-name"
                      name="name"
                      value={shippingAddress.name}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-email">Email</Label>
                    <Input
                      id="shipping-email"
                      name="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={handleShippingChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-phone">Phone</Label>
                    <Input
                      id="shipping-phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-pincode">Pincode</Label>
                    <Input
                      id="shipping-pincode"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="shipping-address">Address</Label>
                    <Input
                      id="shipping-address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-city">City</Label>
                    <Input
                      id="shipping-city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-state">State</Label>
                    <Input
                      id="shipping-state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Choose Payment Method
              </Label>
              <div className="grid gap-2">
                {paymentMethods.map((method) => (
                  <PaymentMethodOption
                    key={method.value}
                    method={method}
                    selected={selectedMethod}
                    onSelect={setSelectedMethod}
                  />
                ))}
              </div>
              {selectedMethod === "card" && (
                <motion.form
                  layout
                  className="space-y-4 pt-4"
                  onSubmit={handlePay}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <Label
                      htmlFor="cardNumber"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      required
                      className="mt-1"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label
                        htmlFor="expiry"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Expiry
                      </Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        required
                        className="mt-1"
                        value={expiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                      />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor="cvc"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        CVC
                      </Label>
                      <Input
                        id="cvc"
                        type="password"
                        placeholder="•••"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <motion.div>
                    <Button
                      type="submit"
                      className="w-full mt-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="animate-spin mr-2">⏳</span>
                      ) : (
                        "Pay Now"
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
              {selectedMethod !== "card" && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pt-4"
                >
                  <Button
                    className="w-full"
                    onClick={handlePay}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="animate-spin mr-2">⏳</span>
                    ) : (
                      `Continue with ${
                        paymentMethods.find((m) => m.value === selectedMethod)
                          .name
                      }`
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 mt-2">
            <span className="text-xs text-gray-400 dark:text-gray-600">
              Your payment is encrypted and secure.
            </span>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Payment;
