import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productApi from "@/api/productApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setTotalItemsInCart } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper for Cloudinary images
  const getCloudinaryUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder-product.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `https://res.cloudinary.com/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload/v1/${imageUrl}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await productApi.get(`/${id}`);
        setProduct(res.data);
        setSelectedColor(res.data.colors?.[0] || "");
        setSelectedSize(res.data.sizes?.[0] || "");
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    console.log("Add to cart clicked", { product, selectedSize, selectedColor }); // Add debug log
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/auth");
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error(
        !selectedSize && !selectedColor
          ? "Please select both size and color."
          : !selectedSize
          ? "Please select a size."
          : "Please select a color."
      );
      return;
    }
    try {
      const itemData = {
        productId: product._id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      };
      await productApi.post(`/${user._id}/add-to-cart`, itemData);
      setTotalItemsInCart((prev) => prev + 1);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        <span className="ml-4 text-gray-600">Loading product...</span>
      </div>
    );
  }

  console.log("Rendering product:", product); // Add debug log to check product data

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-red-500">{error || "Product not found."}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="container max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Gallery */}
          <div className="flex flex-col md:w-1/2">
            <div className="border rounded-lg overflow-hidden bg-white flex items-center justify-center h-96">
              <img
                src={getCloudinaryUrl(product.images?.[selectedImage]?.url)}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex gap-2 mt-4">
              {product.images?.map((img, idx) => (
                <button
                  key={img._id || idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`border rounded-lg p-1 w-20 h-20 flex items-center justify-center ${
                    selectedImage === idx
                      ? "border-indigo-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={getCloudinaryUrl(img.url)}
                    alt={`thumb-${idx}`}
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {/* Category moved here */}
            <div className="text-sm text-gray-500 mb-2">
              Category: <span className="font-medium">{product.category}</span>
            </div>
            <span className="text-2xl font-semibold text-indigo-700">
              ${Number(product.price).toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
              <span className="text-gray-500 text-sm">
                ({product.stock} available)
              </span>
            </div>
            <p className="text-gray-700">{product.description}</p>
            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <div className="font-medium mb-1">Color:</div>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-indigo-600"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color,
                        borderColor:
                          color.toLowerCase() === "white"
                            ? "#e2e8f0"
                            : selectedColor === color
                            ? "#6366f1"
                            : "#d1d5db",
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="font-medium mb-1 mt-2">Size:</div>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded border text-sm font-medium ${
                        selectedSize === size
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-800 border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Actions */}
            <div className="flex gap-4 mt-4">
              <Button
                variant="default"
                size="lg"
                className="flex-1"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              {/* Customize button removed */}
            </div>
          </div>
        </div>
      </div>
      <div className="container max-w-6xl mx-auto px-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {/* TODO: Implement screenshot functionality */}}
        >
          Take screenshot
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
