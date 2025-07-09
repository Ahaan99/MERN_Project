import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "@/store/slices/productSlice";
import { createProduct } from "@/services/productService";
import { useNavigate } from "react-router-dom";
import axios from "@/services/axios"; // Make sure you're importing the custom axios instance

export function AddProduct() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "t-shirts",
    colors: [],
    sizes: [],
    stock: 0,
  });

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (!auth.token || !auth.user?.isAdmin) {
      toast.error("Please login as admin first");
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  const categories = [
    { value: "t-shirts", label: "T-Shirts" },
    { value: "hoodies", label: "Hoodies" },
    { value: "tanks", label: "Tank Tops" },
    { value: "sweatshirts", label: "Sweatshirts" },
  ];

  const availableColors = [
    { hex: "#ffffff", name: "White" },
    { hex: "#000000", name: "Black" },
    { hex: "#ff0000", name: "Red" },
    { hex: "#0000ff", name: "Blue" },
  ];

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      if (!auth.token || !auth.user?.isAdmin) {
        throw new Error("Admin access required");
      }

      const formPayload = new FormData();

      // Append basic fields
      formPayload.append("name", formData.name);
      formPayload.append("description", formData.description);
      formPayload.append("price", formData.price);
      formPayload.append("category", formData.category);
      formPayload.append("stock", formData.stock);

      // Convert arrays to strings
      formPayload.append("colors", JSON.stringify(formData.colors));
      formPayload.append("sizes", JSON.stringify(formData.sizes));

      // Append each image file individually
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formPayload.append(`images`, image);
        });
      }

      // Add content type header
      const { data } = await axios.post("/products", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Add product error:", error);
      if (error.message === "Admin access required") {
        toast.error("Please login as admin first");
        navigate("/admin/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stock: parseInt(e.target.value),
                    }))
                  }
                  required
                />
              </div>
            </div>

            {/* Images and Variants */}
            <div className="space-y-4">
              <div>
                <Label>Product Images</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs text-gray-400">
                      PNG, JPG up to 10MB
                    </div>
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImages(images.filter((_, i) => i !== index))
                          }
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Available Colors</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          colors: prev.colors.includes(color)
                            ? prev.colors.filter((c) => c.hex !== color.hex)
                            : [...prev.colors, color],
                        }));
                      }}
                      className={`w-full p-2 rounded border ${
                        formData.colors.find((c) => c.hex === color.hex)
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div
                        className="w-full h-8 rounded"
                        style={{
                          backgroundColor: color.hex,
                          border:
                            color.hex === "#ffffff"
                              ? "1px solid #e2e8f0"
                              : "none",
                        }}
                      />
                      <span className="text-xs mt-1 block">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Available Sizes</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          sizes: prev.sizes.includes(size)
                            ? prev.sizes.filter((s) => s !== size)
                            : [...prev.sizes, size],
                        }));
                      }}
                      className={`p-2 rounded border ${
                        formData.sizes.includes(size)
                          ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  name: "",
                  description: "",
                  price: "",
                  category: "t-shirts",
                  colors: [],
                  sizes: [],
                  stock: 0,
                });
                setImages([]);
              }}
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
