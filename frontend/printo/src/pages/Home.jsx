import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";

export function Home() {
  const fileInputRef = useRef(null);
  const [uploadedDesign, setUploadedDesign] = useState(null);
  const [productType, setProductType] = useState("T-Shirt");
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(24.99);

  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();

  const productTypes = [
    { name: "T-Shirt", price: 24.99 },
    { name: "Hoodie", price: 39.99 },
    { name: "Tank Top", price: 19.99 },
    { name: "Sweatshirt", price: 34.99 },
    { name: "Long Sleeve", price: 29.99 },
    { name: "Polo", price: 27.99 },
  ];

  const colors = [
    { hex: "#ffffff", name: "White", border: true },
    { hex: "#000000", name: "Black" },
    { hex: "#ef4444", name: "Red" },
    { hex: "#3b82f6", name: "Blue" },
    { hex: "#10b981", name: "Green" },
    { hex: "#f59e0b", name: "Yellow" },
    { hex: "#8b5cf6", name: "Purple" },
    { hex: "#ec4899", name: "Pink" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];

  const handleProductTypeChange = (type) => {
    setProductType(type.name);
    setPrice(type.price * quantity);
  };

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(99, newQuantity));
    setQuantity(validQuantity);
    const selectedProduct = productTypes.find((p) => p.name === productType);
    setPrice(selectedProduct.price * validQuantity);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedDesign(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedDesign(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Design & Print Custom Apparel With Ease
              </h1>
              <p className="text-indigo-100 text-lg mb-8">
                Upload your designs, choose your products, and we'll handle the
                rest. Quality printing, fast shipping, no minimum orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/customize">
                  <Button size="lg" variant="secondary">
                    Start Designing
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white hover:bg-white hover:text-indigo-600"
                  >
                    View Products
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8fafc' rx='10' /%3E%3Cpath d='M150,100 L250,100 L250,300 L150,300 Z' fill='%23ffffff' stroke='%23e2e8f0' stroke-width='2' /%3E%3Cpath d='M150,100 C150,100 170,150 200,150 C230,150 250,100 250,100' fill='%23ffffff' stroke='%23e2e8f0' stroke-width='2' /%3E%3Ccircle cx='200' cy='200' r='40' fill='%236366f1' opacity='0.7' /%3E%3Ctext x='200' y='205' font-family='Arial' font-size='12' text-anchor='middle' fill='%23ffffff'%3EYour Design%3C/text%3E%3C/svg%3E"
                  alt="T-shirt mockup"
                  className="rounded-lg shadow-2xl max-w-full h-auto"
                />
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 font-bold py-1 px-3 rounded-full shadow-lg">
                  New!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Customizer */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Customize Your Product
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Preview */}
            <div className="lg:w-1/2 bg-gray-50 rounded-xl p-6 shadow-lg">
              <div
                className="bg-white rounded-lg p-8 flex justify-center items-center h-[500px]"
                id="product-display"
              >
                <div className="flex relative">
                  <img src="t2.png" alt="sample product" />
                  {uploadedDesign && (
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-4/5 items-center justify-center w-40 h-40"
                    >
                      <img
                        src={uploadedDesign}
                        alt="Uploaded design"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="flex space-x-3">
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    id="zoom-in"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      ></path>
                    </svg>
                  </button>
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    id="zoom-out"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                      ></path>
                    </svg>
                  </button>
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    id="rotate-left"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      ></path>
                    </svg>
                  </button>
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    id="rotate-right"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </button>
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    id="reset-design"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Customization Options */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  Upload Your Design
                </h3>
                <div
                  className="upload-area p-8 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-600 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={handleBrowseClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-indigo-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-600 mb-2">
                    Drag and drop your design here
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Supports PNG, JPG, SVG (Max 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                    Browse Files
                  </button>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">
                    AI Design Recommendations
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="recommendation bg-gray-50 p-3 rounded-lg cursor-pointer hover:shadow-md">
                      <div className="bg-indigo-100 rounded-lg p-2 flex justify-center items-center h-20 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-xs text-center text-gray-600">
                        Minimalist
                      </p>
                    </div>
                    <div className="recommendation bg-gray-50 p-3 rounded-lg cursor-pointer hover:shadow-md">
                      <div className="bg-pink-100 rounded-lg p-2 flex justify-center items-center h-20 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-pink-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-xs text-center text-gray-600">
                        Trendy
                      </p>
                    </div>
                    <div className="recommendation bg-gray-50 p-3 rounded-lg cursor-pointer hover:shadow-md">
                      <div className="bg-amber-100 rounded-lg p-2 flex justify-center items-center h-20 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-amber-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-xs text-center text-gray-600">
                        Colorful
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Product Options</h3>

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Product Type</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {productTypes.map((type) => (
                      <button
                        key={type.name}
                        onClick={() => handleProductTypeChange(type)}
                        className={`py-2 px-4 border rounded-lg text-center transition-colors ${
                          productType === type.name
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                            : "border-gray-300 hover:border-indigo-600 hover:text-indigo-600"
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Color</h4>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((colorOption) => (
                      <button
                        key={colorOption.hex}
                        onClick={() => setColor(colorOption.hex)}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          color === colorOption.hex
                            ? "scale-110 ring-2 ring-indigo-600 ring-offset-2"
                            : ""
                        }`}
                        style={{
                          backgroundColor: colorOption.hex,
                          border: colorOption.border
                            ? "1px solid #e2e8f0"
                            : "none",
                        }}
                        title={colorOption.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Size</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {sizes.map((sizeOption) => (
                      <button
                        key={sizeOption}
                        onClick={() => setSize(sizeOption)}
                        className={`py-2 border rounded-lg text-center transition-colors ${
                          size === sizeOption
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                            : "border-gray-300 hover:border-indigo-600 hover:text-indigo-600"
                        }`}
                      >
                        {sizeOption}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Quantity</h4>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value))
                      }
                      className="w-16 py-1 border-t border-b border-gray-300 text-center focus:outline-none"
                      min="1"
                      max="99"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Price</h4>
                    <p className="text-2xl font-bold">${price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      // Add to cart logic here
                      toast.success("Added to cart!");
                    }}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Creating your custom apparel is simple with our easy-to-use
            platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                1. Upload Your Design
              </h3>
              <p className="text-gray-600">
                Upload your artwork or use our design tools to create something
                unique.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Choose Products</h3>
              <p className="text-gray-600">
                Select from a variety of high-quality apparel and customize
                colors and sizes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. We Print & Ship</h3>
              <p className="text-gray-600">
                We'll handle the printing and shipping directly to you or your
                customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Popular Products
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Choose from our best-selling items and add your unique designs to
            create something special.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="product-preview bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-64 overflow-hidden">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f1f5f9' /%3E%3Cpath d='M75,50 L225,50 L250,110 L300,90 L270,180 L250,180 L250,250 L50,250 L50,180 L30,180 L0,90 L50,110 L75,50' fill='%23ffffff' stroke='%23e2e8f0' strokeWidth='2' /%3E%3Cpath d='M75,50 C75,50 100,80 150,80 C190,80 225,50 225,50' fill='none' stroke='%23e2e8f0' strokeWidth='2' /%3E%3C/svg%3E"
                  alt="Classic T-Shirt"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Classic T-Shirt</h3>
                <p className="text-gray-600 text-sm mb-3">
                  100% Premium Cotton
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">$24.99</span>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition">
                    Customize
                  </button>
                </div>
              </div>
            </div>

            <div className="product-preview bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-64 overflow-hidden">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f1f5f9' /%3E%3Cpath d='M60,50 L240,50 L240,250 L60,250 Z' fill='%23ffffff' stroke='%23e2e8f0' strokeWidth='2' /%3E%3Cpath d='M60,50 L100,50 L100,80 L60,80 Z' fill='%23ffffff' stroke='%23e2e8f0' strokeWidth='2' /%3E%3Cpath d='M240,50 L200,50 L200,80 L240,80 Z' fill='%23ffffff' stroke='%23e2e8f0' strokeWidth='2' /%3E%3Cpath d='M120,150 L180,150 L180,190 L120,190 Z' fill='%23f1f5f9' stroke='%23e2e8f0' strokeWidth='2' /%3E%3C/svg%3E"
                  alt="Hoodie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Premium Hoodie</h3>
                <p className="text-gray-600 text-sm mb-3">Warm & Comfortable</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">$39.99</span>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition">
                    Customize
                  </button>
                </div>
              </div>
            </div>

            <div className="product-preview bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-64 overflow-hidden">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f1f5f9' /%3E%3Cpath d='M90,50 L210,50 L230,80 L230,250 L70,250 L70,80 Z' fill='%23ffffff' stroke='%23e2e8f0' strokeWidth='2' /%3E%3Cpath d='M90,50 C90,50 110,70 150,70 C190,70 210,50 210,50' fill='none' stroke='%23e2e8f0' strokeWidth='2' /%3E%3C/svg%3E"
                  alt="Tank Top"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Tank Top</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Lightweight & Breathable
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">$19.99</span>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition">
                    Customize
                  </button>
                </div>
              </div>
            </div>

            <div className="product-preview bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-64 overflow-hidden">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f1f5f9' /%3E%3Cpath d='M75,50 L225,50 L250,110 L250,250 L50,250 L50,110 Z' fill='%23ffffff' stroke='%23e2e8f0' strokeWidth='2' /%3E%3Cpath d='M75,50 C75,50 100,80 150,80 C200,80 225,50 225,50' fill='none' stroke='%23e2e8f0' strokeWidth='2' /%3E%3Cpath d='M50,110 L50,130 L20,170 L50,170 L50,190 L20,230 L50,230' fill='none' stroke='%23e2e8f0' strokeWidth='2' /%3E%3Cpath d='M250,110 L250,130 L280,170 L250,170 L250,190 L280,230 L250,230' fill='none' stroke='%23e2e8f0' strokeWidth='2' /%3E%3C/svg%3E"
                  alt="Long Sleeve"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Long Sleeve Tee</h3>
                <p className="text-gray-600 text-sm mb-3">Soft & Durable</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">$29.99</span>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition">
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition">
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jane Doe</h4>
                  <p className="text-gray-500 text-sm">Graphic Designer</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-amber-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-gray-600">
                "The quality of the prints exceeded my expectations. The colors
                are vibrant and the fabric feels premium. I'll definitely be
                ordering more for my design business."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">MS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Mike Smith</h4>
                  <p className="text-gray-500 text-sm">Small Business Owner</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-amber-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-gray-600">
                "PrintCanvas has been a game-changer for my business. The
                platform is so easy to use, and my customers love the custom
                merch. Fast shipping and great customer service too!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">AL</span>
                </div>
                <div>
                  <h4 className="font-semibold">Amy Lee</h4>
                  <p className="text-gray-500 text-sm">Artist</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-amber-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-gray-600">
                "I love how easy it is to upload my artwork and see it on
                different products. The AI design recommendations are
                surprisingly helpful too. My art prints look amazing on their
                apparel!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Create Your Custom Apparel?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have brought their designs
            to life with PrintCanvas.
          </p>
          <button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
            Start Designing Now
          </button>
        </div>
      </section>
    </div>
  );
}
