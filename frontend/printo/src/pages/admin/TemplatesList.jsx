import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "@/services/axios";

export function TemplatesList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    frontImage: null,
    backImage: null,
    baseProduct: "",
  });

  useEffect(() => {
    fetchTemplates();
    fetchProducts();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await axios.get("/templates");
      setTemplates(data);
    } catch (error) {
      toast.error("Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/products");
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, formData[key]);
      });

      await axios.post("/templates", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Template created successfully");
      fetchTemplates();
      setFormData({
        name: "",
        category: "",
        description: "",
        frontImage: null,
        backImage: null,
        baseProduct: "",
      });
    } catch (error) {
      toast.error("Failed to create template");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/templates/${id}`);
      toast.success("Template deleted successfully");
      setTemplates(templates.filter((t) => t._id !== id));
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Templates Management</h1>

      {/* Add Template Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Template</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full p-2 border rounded-md"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="frontImage">Front Image</Label>
              <Input
                id="frontImage"
                type="file"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    frontImage: e.target.files[0],
                  }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="backImage">Back Image</Label>
              <Input
                id="backImage"
                type="file"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    backImage: e.target.files[0],
                  }))
                }
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="baseProduct">Base Product</Label>
              <select
                id="baseProduct"
                className="w-full p-2 border rounded-md"
                value={formData.baseProduct}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    baseProduct: e.target.value,
                  }))
                }
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Template
          </Button>
        </form>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative aspect-square">
              <img
                src={template.images.front?.url}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {template.description}
              </p>
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(template._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
