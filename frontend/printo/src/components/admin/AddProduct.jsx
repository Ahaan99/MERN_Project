import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiImage, FiTag, FiDollarSign } from "react-icons/fi";
import { IoRemoveCircle } from "react-icons/io5";
import { motion } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import productApi from "@/api/productApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const AddProduct = ({ product, onSuccess }) => {
  const { user } = useAuth();
  const [imageFiles, setImageFiles] = React.useState([]);
  const [imagePreviews, setImagePreviews] = React.useState([]);
  const [colorInput, setColorInput] = React.useState("");
  const [sizeInput, setSizeInput] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(
    product?.category || ""
  );
  const [name, setName] = React.useState(product?.name || "");
  const [price, setPrice] = React.useState(product?.price || "");
  const [stock, setStock] = React.useState(product?.stock || "");
  const [description, setDescription] = React.useState(
    product?.description || ""
  );
  const [loading, setLoading] = React.useState(false);

  // Track which existing images are removed (for edit mode)
  const [removedImageIndexes, setRemovedImageIndexes] = React.useState([]);

  const categories = ["T-Shirts", "Hoodies", "Jeans", "Jackets", "Accessories"];

  // Helper to ensure array and flatten any stringified arrays inside
  const parseArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const arr = JSON.parse(val);
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Helper to flatten any stringified arrays inside the array
  const flattenArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    let flat = [];
    arr.forEach((item) => {
      if (
        typeof item === "string" &&
        item.startsWith("[") &&
        item.endsWith("]")
      ) {
        try {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) flat = flat.concat(parsed);
        } catch {
          flat.push(item);
        }
      } else {
        flat.push(item);
      }
    });
    return flat;
  };

  const [colors, setColors] = React.useState(
    flattenArray(parseArray(product?.colors))
  );
  const [sizes, setSizes] = React.useState(
    flattenArray(parseArray(product?.sizes))
  );

  React.useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setStock(product.stock || "");
      setDescription(product.description || "");
      setSelectedCategory(product.category || "");
      setColors(flattenArray(parseArray(product.colors)));
      setSizes(flattenArray(parseArray(product.sizes)));
      setImagePreviews(
        product.images ? product.images.map((img) => img.url) : []
      );
      setImageFiles([]);
      setRemovedImageIndexes([]);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleAddColor = (e) => {
    e.preventDefault();
    const flatColors = flattenArray(colors);
    const newColor = colorInput.trim().toLowerCase();
    if (newColor && !flatColors.includes(newColor)) {
      setColors([...flatColors, newColor]);
      setColorInput("");
    }
  };

  const handleRemoveColor = (color) => {
    setColors(colors.filter((c) => c !== color));
  };

  const handleAddSize = (e) => {
    e.preventDefault();
    const flatSizes = flattenArray(sizes);
    const newSize = sizeInput.trim().toUpperCase();
    if (newSize && !flatSizes.includes(newSize)) {
      setSizes([...flatSizes, newSize]);
      setSizeInput("");
    }
  };

  const handleRemoveSize = (size) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  // Remove image handler
  const handleRemoveImage = (idx) => {
    // If editing, track removed images by index
    if (product && product.images && idx < product.images.length) {
      setRemovedImageIndexes((prev) => [...prev, idx]);
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setImageFiles((prev) =>
      prev.filter(
        (_, i) =>
          i !== idx - (product && product.images ? product.images.length : 0)
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock || !description || !selectedCategory) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("category", selectedCategory);
    formData.append("colors", JSON.stringify(colors));
    formData.append("sizes", JSON.stringify(sizes));
    imageFiles.forEach((file) => formData.append("images", file));
    if (product && removedImageIndexes.length > 0) {
      formData.append("removeImages", JSON.stringify(removedImageIndexes));
    }
    try {
      if (product && product._id) {
        await productApi.put(`/${product._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (onSuccess) onSuccess();
        toast.success("Product updated successfully!");
      } else {
        await productApi.post(`/${user._id}/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (onSuccess) onSuccess();
        toast.success("Product added successfully!");
      }
    } catch (err) {
      toast.error(
        product ? "Failed to update product." : "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <FiTag className="text-primary" />{" "}
            {product ? "Edit Product" : "Add New Product"}
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[80vh] overflow-auto">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <FiTag /> Product Name
              </Label>
              <Input
                id="name"
                placeholder="Enter product name"
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="price" className="flex items-center gap-2">
                <FiDollarSign /> Price
              </Label>
              <Input
                id="price"
                placeholder="$0.00"
                className="mt-1"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="stock" className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-green-400 mr-1" />
                Stock
              </Label>
              <Input
                id="stock"
                placeholder="Enter stock quantity"
                className="mt-1"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description" className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-yellow-300 mr-1" />
                Product Description
              </Label>
              <textarea
                id="description"
                placeholder="Enter product description"
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="image-upload" className="flex items-center gap-2">
                <FiImage /> Upload Images
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                className="mt-1"
                onChange={handleImageChange}
                multiple
              />
              {imagePreviews.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-md border border-gray-200 shadow"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full text-gray-500 hover:text-red-600 shadow group-hover:opacity-100 opacity-80"
                        onClick={() => handleRemoveImage(idx)}
                        aria-label="Remove image"
                      >
                        <IoRemoveCircle size={22} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="color-input" className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 mr-1" />
                Available Colors
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="color-input"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="e.g. red, blue, #fff, etc."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddColor(e);
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddColor}
                >
                  Add
                </Button>
              </div>
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {colors.map((color, idx) => (
                    <span
                      key={color}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm border border-gray-300 shadow-sm"
                    >
                      <span
                        className="inline-block w-4 h-4 rounded-full border mr-1"
                        style={{ background: color }}
                      />
                      {color}
                      <button
                        type="button"
                        className="ml-1 text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveColor(color)}
                        aria-label={`Remove color ${color}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="size-input" className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-blue-400 mr-1" />
                Available Sizes
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="size-input"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="e.g. S, M, L, XL, etc."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSize(e);
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddSize}
                >
                  Add
                </Button>
              </div>
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm border border-gray-300 shadow-sm"
                    >
                      <span className="inline-block w-4 h-4 rounded-full bg-blue-400 mr-1" />
                      {size}
                      <button
                        type="button"
                        className="ml-1 text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveSize(size)}
                        aria-label={`Remove size ${size}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="category" className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-purple-400 mr-1" />
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full mt-4"
              variant="default"
              disabled={loading}
            >
              {loading
                ? product
                  ? "Updating..."
                  : "Adding..."
                : product
                ? "Update Product"
                : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddProduct;
