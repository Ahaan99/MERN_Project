import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Cart() {
  const { items, removeItem, getTotal, getItemCount } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to continue shopping
          </p>
          <Button onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart ({getItemCount()} items)
      </h1>

      <div className="space-y-8">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.size}-${item.color}`}
            className="flex gap-6 py-6 border-b"
          >
            <img
              src={
                item.customization?.frontImage
                  ? item.customization.frontImage
                  : item.product.images?.[0]?.url
              }
              alt={item.product.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">Size: {item.size}</p>
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-gray-500">× {item.quantity}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id, item.size, item.color)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-6 border-t">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg">Total</span>
            <span className="text-2xl font-bold">${getTotal().toFixed(2)}</span>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
            <Button className="flex-1" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
