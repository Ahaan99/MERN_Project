import React, { useState, useEffect } from "react";
import axios from "@/services/axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { sampleProducts } from "@/data/sampleProducts";
import { CartDialog } from "@/components/CartDialog"; // Update this line
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import productApi from "@/api/productApi";
import { useAuth } from "@/context/AuthContext";

export function Products() {
  const { products, setProducts } = useAuth();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [gender, setGender] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedColors, setSelectedColors] = useState({}); // productId -> color
  const [selectedSizes, setSelectedSizes] = useState({}); // productId -> size
  const { user, setTotalItemsInCart } = useAuth();
  const navigate = useNavigate();

  const categories = {
    men: [
      { value: "T-Shirts", label: "T-Shirts" },
      { value: "Hoodies", label: "Hoodies" },
      { value: "Shirts", label: "Shirts" },
      { value: "Polo T-Shirts", label: "Polo T-Shirts" },
      { value: "Tank Tops", label: "Tank Tops" },
      { value: "Jackets", label: "Jackets" },
      { value: "Sweaters", label: "Sweaters" },
    ],
    women: [
      { value: "T-Shirts", label: "T-Shirts" },
      { value: "Hoodies", label: "Hoodies" },
      { value: "Tops", label: "Tops" },
      { value: "Blouses", label: "Blouses" },
      { value: "Tank Tops", label: "Tank Tops" },
      { value: "Dresses", label: "Dresses" },
      { value: "Sweaters", label: "Sweaters" },
    ],
    all: [
      { value: "T-Shirts", label: "T-Shirts" },
      { value: "Hoodies", label: "Hoodies" },
      { value: "Tops", label: "Tops" },
      { value: "Shirts", label: "Shirts" },
      { value: "Tank Tops", label: "Tank Tops" },
      { value: "Jackets", label: "Jackets & Outerwear" },
      { value: "Sweaters", label: "Sweaters & Cardigans" },
    ],
  };

  const getCloudinaryUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder-product.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `https://res.cloudinary.com/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload/v1/${imageUrl}`;
  };

  // Helper to get image for selected color (assumes images/colors are aligned by index)
  const getImageForColor = (product) => {
    const selectedColor = selectedColors[product._id];
    if (!selectedColor) return product.images[0]?.url;
    const colorIndex = product.colors.findIndex(
      (color) => color === selectedColor
    );
    return product.images[colorIndex]?.url || product.images[0]?.url;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.get("/");
        setProducts(response.data);
      } catch (error) {
        toast.error("Failed to load products");
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortProducts = (products) => {
    return products.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "popular":
        default:
          // If no popularity field, sort by newest as fallback
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const filteredAndSortedProducts = sortProducts(
    products
      .filter((product) => !product.customizable) // Filter out customizable products
      .filter((product) => {
        const matchesCategory =
          category === "all" || product.category === category;
        // Remove gender filtering if not present in real data
        const matchesGender = true;
        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesCategory && matchesGender && matchesPrice;
      })
  );

  // Add to cart logic from QuickViewModal
  const handleAddToCart = async (product) => {
    const selectedSize = selectedSizes[product._id];
    const selectedColor = selectedColors[product._id];
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/auth");
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color");
      return;
    }
    const itemData = {
      productId: product._id,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    };
    try {
      await productApi.post(`/${user._id}/add-to-cart`, itemData);
      setTotalItemsInCart((prev) => prev + 1);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

  const handleCustomizeClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shop Collection
          </h1>
          <p className="text-gray-600">
            Discover and customize your perfect style
          </p>
        </div>
        <CartDialog /> {/* Update this line */}
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories[gender].map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-[200px] space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Category Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {categories[gender].map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`p-3 rounded-lg text-center transition-colors ${
              category === cat.value
                ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-600"
                : "bg-white border border-gray-200 hover:border-indigo-600 hover:text-indigo-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="relative h-64 overflow-hidden group">
                <img
                  src={getImageForColor(product)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    {product.stock > 0 ? (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col h-full flex-1">
                <div className="flex justify-between items-center mb-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h3
                          className="font-semibold text-lg cursor-pointer truncate max-w-[70%] text-ellipsis"
                          onClick={() => navigate(`/products/${product._id}`)}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {product.name}
                        </h3>
                      </TooltipTrigger>
                      <TooltipContent>{product.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="font-bold text-lg text-gray-900 ml-2 whitespace-nowrap">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      className={`text-xs border rounded px-2 py-1 transition-colors ${
                        selectedSizes[product._id] === size
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 hover:border-indigo-600 hover:text-indigo-600"
                      }`}
                      onClick={() =>
                        setSelectedSizes((prev) => ({
                          ...prev,
                          [product._id]: size,
                        }))
                      }
                      type="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {product.colors?.length > 0 && (
                  <div className="flex gap-1 mb-3">
                    {product.colors.map((color, idx) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-150 ${
                          selectedColors[product._id] === color
                            ? "border-indigo-600 scale-110"
                            : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: color,
                          borderColor:
                            color.toLowerCase() === "white"
                              ? "#e2e8f0"
                              : undefined,
                        }}
                        title={color}
                        onClick={() =>
                          setSelectedColors((prev) => ({
                            ...prev,
                            [product._id]: color,
                          }))
                        }
                        aria-label={`Select color ${color}`}
                        type="button"
                      />
                    ))}
                  </div>
                )}
                <div className="flex-1" />
                <div className="flex items-center justify-between gap-2 mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleAddToCart(product)}
                            disabled={
                              !selectedSizes[product._id] ||
                              !selectedColors[product._id]
                            }
                          >
                            Add to Cart
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {!selectedSizes[product._id] &&
                        !selectedColors[product._id]
                          ? "Please select both size and color"
                          : !selectedSizes[product._id]
                          ? "Please select a size"
                          : !selectedColors[product._id]
                          ? "Please select a color"
                          : "Click to add to cart"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {/* Customize button removed */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* Active Filters Display */}
      {(gender !== "all" || category !== "all") && (
        <div className="flex gap-2 mb-6">
          {gender !== "all" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-600">
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
              <button
                onClick={() => setGender("all")}
                className="ml-2 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          )}
          {category !== "all" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-600">
              {categories[gender].find((cat) => cat.value === category)?.label}
              <button
                onClick={() => setCategory("all")}
                className="ml-2 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
