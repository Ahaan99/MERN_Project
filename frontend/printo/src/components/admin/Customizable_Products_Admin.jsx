import React, { useState, useRef, useEffect } from "react";
// ShadCN UI components (install @shadcn/ui or use your own setup)
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
// Framer Motion
import { motion, AnimatePresence } from "framer-motion";
// React Icons
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiTag,
  FiDollarSign,
  FiLayers,
  FiHash,
  FiChevronDown,
} from "react-icons/fi";
import adminApi from "@/api/adminApi"; // <-- use adminApi instead of productApi
import { toast } from "sonner";

const categories = [
  { value: "t-shirts", label: "T-Shirts" },
  { value: "hoodies", label: "Hoodies" },
  { value: "jackets", label: "Jackets" },
  // ...add more categories
];

function AddProductModal({
  open,
  onOpenChange,
  onSubmit,
  initialProduct = null,
  loading = false,
}) {
  // If editing, prefill fields
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [colors, setColors] = useState(initialProduct?.colors || []);
  const [sizes, setSizes] = useState(initialProduct?.sizes || []);
  const [images, setImages] = useState([null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null]);
  const [name, setName] = useState(initialProduct?.name || "");
  const [price, setPrice] = useState(initialProduct?.price || "");
  const [stock, setStock] = useState(initialProduct?.stock || "");
  const [description, setDescription] = useState(
    initialProduct?.description || ""
  );
  const [category, setCategory] = useState(initialProduct?.category || "");
  const [customizable, setCustomizable] = useState(
    initialProduct?.customizable || false
  );
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // For editing: show existing images as previews
  useEffect(() => {
    if (initialProduct) {
      setColors(initialProduct.colors || []);
      setSizes(initialProduct.sizes || []);
      setName(initialProduct.name || "");
      setPrice(initialProduct.price || "");
      setStock(initialProduct.stock || "");
      setDescription(initialProduct.description || "");
      setCategory(initialProduct.category || "");
      setCustomizable(initialProduct.customizable || false);
      // Show existing images as previews
      const previews = [null, null];
      if (initialProduct.images && initialProduct.images.length > 0) {
        for (let i = 0; i < Math.min(2, initialProduct.images.length); i++) {
          previews[i] = initialProduct.images[i].url;
        }
      }
      setImagePreviews(previews);
      setImages([null, null]); // Reset file uploads
    } else {
      setColors([]);
      setSizes([]);
      setName("");
      setPrice("");
      setStock("");
      setDescription("");
      setCategory("");
      setCustomizable(false);
      setImagePreviews([null, null]);
      setImages([null, null]);
    }
    setError("");
  }, [initialProduct, open]);

  // Handle file input change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Only allow one image to be uploaded at a time (to the first empty slot)
    if (files.length > 0) {
      const file = files[0];
      const newImages = [...images];
      const newPreviews = [...imagePreviews];
      const idx = newImages.findIndex((img) => img === null);
      if (idx !== -1) {
        newImages[idx] = file;
        newPreviews[idx] = URL.createObjectURL(file);
        setImages(newImages);
        setImagePreviews(newPreviews);
      }
    }
    // Reset file input so user can select the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove image
  const removeImage = (idx) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages[idx] = null;
    // If editing and preview is a URL, mark for removal
    if (
      initialProduct &&
      initialProduct.images &&
      initialProduct.images[idx] &&
      typeof newPreviews[idx] === "string" &&
      newPreviews[idx] === initialProduct.images[idx].url
    ) {
      // Mark for removal by setting preview to null
      newPreviews[idx] = null;
    } else {
      newPreviews[idx] = null;
    }
    setImages(newImages);
    setImagePreviews(newPreviews);
    // Reset file input so user can select the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add color on Enter key or Add button
  const handleColorInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (colorInput.trim()) {
        setColors([...colors, colorInput.trim()]);
        setColorInput("");
      }
    }
  };

  // Add size on Enter key or Add button
  const handleSizeInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (sizeInput.trim()) {
        setSizes([...sizes, sizeInput.trim()]);
        setSizeInput("");
      }
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validation
    if (!name || !price || !stock || !description || !category) {
      setError("Please fill all required fields.");
      return;
    }
    if (colors.length === 0 || sizes.length === 0) {
      setError("Please add at least one color and one size.");
      return;
    }
    // Prepare FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("category", category);
    // Send as JSON stringified arrays (important for express-validator)
    formData.append("colors", JSON.stringify(colors));
    formData.append("sizes", JSON.stringify(sizes));
    // Only support unisex for now
    formData.append("gender", initialProduct?.gender || "unisex");
    // Images: add new files
    images.forEach((img) => {
      if (img) formData.append("images", img);
    });
    // For editing: mark removed images by index
    let removeImages = [];
    if (initialProduct && initialProduct.images) {
      for (let i = 0; i < 2; i++) {
        if (
          initialProduct.images[i] &&
          (!imagePreviews[i] ||
            imagePreviews[i] !== initialProduct.images[i].url)
        ) {
          removeImages.push(i);
        }
      }
    }
    if (removeImages.length > 0) {
      formData.append("removeImages", JSON.stringify(removeImages));
    }
    formData.append("customizable", customizable);
    // Call parent onSubmit
    await onSubmit(formData, initialProduct?._id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="">
      <DialogContent className="w-full max-h-[98%] overflow-auto rounded-2xl p-6 dark:bg-zinc-900 bg-white hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <FiTag className="text-primary" />{" "}
            {initialProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Customizable Toggle */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-purple-600 dark:text-purple-400">
              <input
                type="checkbox"
                checked={customizable}
                onChange={(e) => setCustomizable(e.target.checked)}
                className="mr-2"
              />
              Customizable Product
            </label>
          </div>
          {/* Product Name */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-zinc-700 dark:text-zinc-200">
              <FiTag /> Product Name
            </label>
            <Input
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* Price */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-zinc-700 dark:text-zinc-200">
              <FiDollarSign /> Price
            </label>
            <Input
              type="number"
              min={0}
              placeholder="$0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {/* Stock */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-green-600 dark:text-green-400">
              <span className="h-3 w-3 rounded-full bg-green-500 inline-block" />{" "}
              Stock
            </label>
            <Input
              type="number"
              min={0}
              placeholder="Enter stock quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          {/* Description */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-yellow-600 dark:text-yellow-400">
              <span className="h-3 w-3 rounded-full bg-yellow-400 inline-block" />{" "}
              Product Description
            </label>
            <Textarea
              placeholder="Enter product description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* Upload Images */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-zinc-700 dark:text-zinc-200">
              <FiImage /> Upload Images (Front & Back)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary"
              onChange={handleImageChange}
              disabled={
                images.filter(Boolean).length +
                  (initialProduct?.images?.length || 0) >=
                2
              }
              style={{ display: "block" }}
              max={2}
              ref={fileInputRef}
            />
            <div className="flex gap-4 mt-2">
              {[0, 1].map((idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden border border-dashed border-zinc-300 dark:border-zinc-700 relative">
                    {imagePreviews[idx] ? (
                      <>
                        <img
                          src={imagePreviews[idx]}
                          alt={idx === 0 ? "Front Preview" : "Back Preview"}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white/80 dark:bg-zinc-900/80 rounded-full p-1 text-xs hover:bg-red-500 hover:text-white transition"
                          onClick={() => removeImage(idx)}
                          aria-label="Remove"
                        >
                          &times;
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-zinc-400">
                        {idx === 0 ? "Front" : "Back"}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {idx === 0 ? "Front" : "Back"}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Only 2 images allowed: one for front and one for back.
            </p>
          </div>
          {/* Available Colors */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-fuchsia-600 dark:text-fuchsia-400">
              <span className="h-3 w-3 rounded-full bg-fuchsia-400 inline-block" />{" "}
              Available Colors
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. red, blue, #fff, etc."
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={handleColorInputKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (colorInput.trim()) {
                    setColors([...colors, colorInput.trim()]);
                    setColorInput("");
                  }
                }}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {colors.map((c, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded flex items-center gap-1"
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <span
                    className="inline-block w-5 h-5 rounded"
                    style={{
                      background: c,
                      border: "1px solid #d1d5db",
                      display: "inline-block",
                    }}
                    title={c}
                  />
                  <button
                    type="button"
                    className="ml-1 text-xs text-zinc-400 hover:text-red-500"
                    onClick={() => {
                      setColors(colors.filter((_, idx) => idx !== i));
                    }}
                    aria-label="Remove color"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Available Sizes */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-blue-600 dark:text-blue-400">
              <span className="h-3 w-3 rounded-full bg-blue-400 inline-block" />{" "}
              Available Sizes
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. S, M, L, XL, etc."
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={handleSizeInputKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (sizeInput.trim()) {
                    setSizes([...sizes, sizeInput.trim()]);
                    setSizeInput("");
                  }
                }}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {sizes.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs flex items-center gap-1"
                >
                  {s}
                  <button
                    type="button"
                    className="ml-1 text-xs text-zinc-400 hover:text-red-500"
                    onClick={() => {
                      setSizes(sizes.filter((_, idx) => idx !== i));
                    }}
                    aria-label="Remove size"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Category */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-fuchsia-600 dark:text-fuchsia-400">
              <span className="h-3 w-3 rounded-full bg-fuchsia-400 inline-block" />{" "}
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Error */}
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}
          {/* Submit */}
          <Button
            className="w-full mt-2"
            size="lg"
            type="submit"
            disabled={loading}
          >
            {loading
              ? initialProduct
                ? "Updating..."
                : "Adding..."
              : initialProduct
              ? "Update Product"
              : "Add Product"}
          </Button>
        </form>
      </DialogContent>
      <style>
        {`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;

            }
            .hide-scrollbar {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
                }
            `}
      </style>
    </Dialog>
  );
}

const tableMotion = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 24,
    transition: { duration: 0.2 },
  },
};

const Customizable_Products_Admin = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch products from backend (admin endpoint)
  const fetchProducts = async () => {
    try {
      const res = await adminApi.get("/products");
      setProducts(res.data);
      console.log("Fetched products:", res.data);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add or update product handler (admin endpoint)
  const handleProductSubmit = async (formData, productId) => {
    setLoading(true);
    try {
      if (productId) {
        // Update
        await adminApi.put(`/products/${productId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add
        await adminApi.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModalOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  // Delete product handler
  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      await adminApi.delete(`/products/${productToDelete._id}`);
      toast.success(`Product "${productToDelete.name}" deleted successfully.`);
      await fetchProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to delete product. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open modal for editing
  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  // Open modal for adding
  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Only show customizable products
  const customizableProducts = products.filter((prod) => prod.customizable);

  return (
    <div className="container mx-auto">
      <motion.div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Products
          </h2>
          <Button
            size="lg"
            className="flex items-center gap-2"
            onClick={handleAdd}
            asChild={false}
          >
            <FiPlus className="text-lg" /> Add Product
          </Button>
        </div>
        <div className="overflow-x-auto">
          <AnimatePresence>
            <motion.div {...tableMotion}>
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="w-28">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customizableProducts.map((prod, idx) => (
                    <TableRow
                      key={prod._id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell>
                        <img
                          src={prod.images && prod.images[0]?.url}
                          alt={prod.name}
                          className="w-14 h-14 object-cover rounded-lg shadow"
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-zinc-800 dark:text-zinc-100">
                        {prod.name}
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        ${prod.price}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-primary/10"
                            aria-label="Edit"
                            onClick={() => handleEdit(prod)}
                          >
                            <FiEdit2 className="text-lg" />
                          </Button>
                          <AlertDialog
                            open={
                              deleteDialogOpen &&
                              productToDelete?._id === prod._id
                            }
                            onOpenChange={(open) => {
                              if (!deleteLoading) {
                                setDeleteDialogOpen(open);
                                if (!open) setProductToDelete(null);
                              }
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-red-100 dark:hover:bg-red-900"
                                aria-label="Delete"
                                onClick={() => {
                                  setProductToDelete(prod);
                                  setDeleteDialogOpen(true);
                                }}
                                disabled={deleteLoading}
                              >
                                <FiTrash2 className="text-lg text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Product
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <b>{prod.name}</b>? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={deleteLoading}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  disabled={deleteLoading}
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  {deleteLoading ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      {/* Render modal directly, add margin top and bottom */}
      <div className="mt-2 mb-2 flex items-center justify-center">
        <AddProductModal
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setEditingProduct(null);
          }}
          onSubmit={handleProductSubmit}
          initialProduct={editingProduct}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Customizable_Products_Admin;
