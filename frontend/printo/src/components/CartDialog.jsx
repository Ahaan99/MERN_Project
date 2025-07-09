import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CartDialog() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, getTotal, getItemCount } = useCartStore();
  const navigate = useNavigate();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {getItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getItemCount()}
            </span>
          )}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-xl z-50 flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold">
                Shopping Cart ({items.length})
              </Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <div 
                        className="w-4 h-4 rounded-full mt-1"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-medium">${item.price.toFixed(2)} x {item.quantity}</p>
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
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-bold">${getTotal().toFixed(2)}</span>
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  setOpen(false);
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
