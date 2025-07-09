import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import productApi from "@/api/productApi";
import { MdDelete } from "react-icons/md";
import Customize_image from "@/components/product/Customize_image";
// Import shadcn AlertDialog components
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const getTotal = (items) =>
  items.reduce(
    (sum, item) =>
      sum + (item.product ? item.product.price * item.quantity : 0),
    0
  );

// Add spinner component (simple)
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-red-500" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const UserCart = () => {
  const { user, fetchCart, cartItems, setCartItems } = useAuth();
  const [loading, setLoading] = useState(false);

  // For AlertDialog
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // For image Dialog
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Log cart items
  console.log(cartItems);

  // Fetch cart data on mount
  useEffect(() => {
    const fetch = async () => {
      await fetchCart(user._id);
    };
    fetch();
  }, []);

  // Update quantity in backend and refresh cart
  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    setLoading(true);
    try {
      // Call backend to update quantity (re-use addToCart endpoint)
      await productApi.post(`/${user._id}/add-to-cart`, {
        productId: item.product._id,
        quantity: delta,
        size: item.size,
        color: item.color,
      });
      // Refresh cart from backend for real-time update
      await fetchCart(user._id);
    } catch (err) {
      // Optionally show error
      console.error("Failed to update cart:", err);
    }
    setLoading(false);
  };

  // Remove item from cart in backend and refresh cart
  const handleRemoveItem = async () => {
    if (!itemToRemove) return;
    setDeletingId(itemToRemove._id);
    setLoading(true);
    try {
      await productApi.post(`/${user._id}/remove-from-cart`, {
        productId: itemToRemove.product._id,
        size: itemToRemove.size,
        color: itemToRemove.color,
      });
      await fetchCart(user._id);
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
    setLoading(false);
    setDeletingId(null);
    setOpenDialog(false);
    setItemToRemove(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-6">My Cart</h2>
      <div className="space-y-4">
        {cartItems.length === 0 && (
          <div className="text-gray-500">Your cart is empty.</div>
        )}
        {cartItems.map((item) => {
          // Try to match color to image by index
          let imgSrc;
          if (
            item.product &&
            item.product.images &&
            item.product.images.length > 0
          ) {
            // Try to find the image index that matches the selected color
            const colorIdx =
              item.product.colors && Array.isArray(item.product.colors)
                ? item.product.colors.findIndex(
                    (c) => c.toLowerCase() === (item.color || "").toLowerCase()
                  )
                : -1;
            if (
              colorIdx !== -1 &&
              item.product.images[colorIdx] &&
              item.product.images[colorIdx].url
            ) {
              imgSrc = item.product.images[colorIdx].url;
            } else {
              imgSrc = item.product.images[0].url;
            }
          } else {
            imgSrc = "https://via.placeholder.com/60x60?text=No+Image";
          }
          return (
            <div
              key={item._id}
              className="flex items-center border-b pb-4 last:border-b-0"
            >
              <Dialog
                open={openImageDialog && selectedItem?._id === item._id}
                onOpenChange={(open) => {
                  setOpenImageDialog(open);
                  if (!open) setSelectedItem(null);
                }}
              >
                <DialogTrigger asChild>
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded bg-gray-100 mr-4 cursor-pointer overflow-hidden"
                    onClick={() => {
                      setSelectedItem(item);
                      setOpenImageDialog(true);
                    }}
                  >
                    {item.customization ? (
                      <div className="w-full h-full">
                        <Customize_image
                          imageUrl={imgSrc}
                          color={item.color}
                          texts={item.customization.texts || []}
                          elements={item.customization.elements || []}
                          images={item.customization.images || []}
                          readOnly={true}
                        />
                      </div>
                    ) : (
                      <img
                        src={imgSrc}
                        alt={item.product ? item.product.name : "No product"}
                        className="w-full h-full object-contain object-center rounded"
                      />
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="flex flex-col justify-center items-center p-4 bg-white max-w-3xl">
                  <DialogTitle>
                    {item.product ? item.product.name : "Product Image"}
                  </DialogTitle>
                  <div className="w-full max-w-2xl mt-4">
                    {item.customization ? (
                      <Customize_image
                        imageUrl={imgSrc}
                        color={item.color}
                        texts={item.customization.texts || []}
                        elements={item.customization.elements || []}
                        images={item.customization.images || []}
                        readOnly={true}
                      />
                    ) : (
                      <img
                        src={imgSrc}
                        alt={item.product ? item.product.name : "No product"}
                        className="w-full object-contain rounded shadow"
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex-1">
                <div className="font-medium">
                  {item.product ? item.product.name : "Product not found"}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  Size: {item.size} | Color:
                  <span
                    className="inline-block w-4 h-4 rounded-full border ml-1"
                    style={{ backgroundColor: item.color, borderColor: "#ccc" }}
                    title={item.color}
                  ></span>
                </div>
                <div className="flex items-center mt-2">
                  <Button
                    variant="outline"
                    className="px-2 py-1 rounded-l border-r-0 bg-gray-100 hover:bg-gray-200"
                    onClick={() => handleQuantityChange(item._id, -1)}
                    disabled={item.quantity === 1 || loading}
                    aria-label="Decrease quantity"
                    type="button"
                  >
                    −
                  </Button>
                  <span className="px-4">{item.quantity}</span>
                  <Button
                    variant="outline"
                    className="px-2 py-1 rounded-r border-l-0 bg-gray-100 hover:bg-gray-200"
                    onClick={() => handleQuantityChange(item._id, 1)}
                    disabled={loading}
                    aria-label="Increase quantity"
                    type="button"
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-end min-w-[80px]">
                <div className="font-semibold">
                  ₹{item.product ? item.product.price * item.quantity : 0}
                </div>
                {/* AlertDialog for delete confirmation */}
                <AlertDialog
                  open={openDialog && itemToRemove?._id === item._id}
                  onOpenChange={(open) => {
                    if (!open) setItemToRemove(null);
                    setOpenDialog(open);
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="mt-2 text-red-500 hover:bg-gray-100 rounded-full p-1"
                      onClick={() => {
                        setItemToRemove(item);
                        setOpenDialog(true);
                      }}
                      disabled={loading}
                      aria-label="Delete item"
                      type="button"
                    >
                      {deletingId === item._id ? (
                        <Spinner />
                      ) : (
                        <MdDelete className="h-5 w-5" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to remove this item?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          setOpenDialog(false);
                          setItemToRemove(null);
                        }}
                        disabled={deletingId === item._id}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRemoveItem}
                        disabled={deletingId === item._id}
                      >
                        {deletingId === item._id ? (
                          <span className="flex items-center gap-2">
                            <Spinner />
                            Deleting...
                          </span>
                        ) : (
                          "Remove"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-between items-center border-t pt-4">
        <span className="font-medium text-lg">Total</span>
        <span className="font-bold text-indigo-600 text-lg">
          ₹{getTotal(cartItems)}
        </span>
      </div>
      <Button
        asChild
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
        disabled={loading}
      >
        <Link to="/user/payment">Proceed to Checkout</Link>
      </Button>
    </div>
  );
};

export default UserCart;
