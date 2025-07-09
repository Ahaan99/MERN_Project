import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/context/AuthContext";
import productApi from "@/api/productApi";

export function QuickViewModal({ product, isOpen, onClose }) {
  const { user, setTotalItemsInCart } = useAuth();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({
    productId: product?._id,
    quantity: 1,
    size: "",
    color: "",
  });
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Update itemData and reset selections when product changes or modal opens
  useEffect(() => {
    setItemData({
      productId: product?._id,
      quantity: 1,
      size: "",
      color: "",
    });
    setSelectedSize("");
    setSelectedColor("");
  }, [product, isOpen]);

  if (!product) return null;

  // Sync itemData.size and itemData.color with selectedSize and selectedColor
  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setItemData((prev) => ({ ...prev, size }));
  };
  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setItemData((prev) => ({ ...prev, color }));
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/auth");
      onClose();
      return;
    }

    try {
      const response = await productApi.post(
        `/${user._id}/add-to-cart`,
        itemData
      );
      setTotalItemsInCart((prev) => prev + 1);
      toast.success("Added to cart!");
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[800px]"
        aria-describedby="quick-view-description"
      >
        <span id="quick-view-description" className="sr-only">
          Quick view of product details, including images, price, description,
          size and color selection, and actions to add to cart or customize.
        </span>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSelectSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedSize === size
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "hover:border-indigo-600 hover:text-indigo-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Select Color</h4>
              <div className="flex gap-2">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleSelectColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-indigo-600 scale-110"
                        : ""
                    }`}
                    style={{
                      backgroundColor: color,
                      borderColor:
                        color.toLowerCase() === "white" ? "#e2e8f0" : color,
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex-1">
                      <Button
                        className="w-full"
                        onClick={handleAddToCart}
                        disabled={!selectedSize || !selectedColor}
                      >
                        Add to Cart
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!selectedSize && !selectedColor
                      ? "Please select both size and color"
                      : !selectedSize
                      ? "Please select a size"
                      : !selectedColor
                      ? "Please select a color"
                      : "Click to add to cart"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onClose();
                  navigate(`/customize/${product._id}`);
                }}
              >
                Customize
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
