import React, { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
// shadcn/ui table components
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import AddProduct from "./AddProduct";
import productApi from "@/api/productApi";
import { toast } from "sonner";

const actionBtnStyle =
  "inline-flex items-center justify-center rounded-md p-2 hover:bg-primary/10 transition-colors text-primary";

const Admin_Products = () => {
  const [products, setProducts] = React.useState([]);
  const [openDeleteId, setOpenDeleteId] = React.useState(null);
  const [editProduct, setEditProduct] = React.useState(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);

  const fetchProducts = async () => {
    const response = await productApi.get("/");
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddEditSuccess = () => {
    setEditDialogOpen(false);
    fetchProducts();
  };

  const handleDeleteProduct = async (productId) => {
    setDeletingId(productId);
    try {
      await productApi.delete(`/${productId}`);
      fetchProducts();
      toast.success("Product deleted successfully!");
      setOpenDeleteId(null);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete product.");
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="ml-4">
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg w-full">
            <AddProduct onSuccess={handleAddEditSuccess} />
          </DialogContent>
        </Dialog>
        {/* Edit Product Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg w-full">
            <AddProduct
              product={editProduct}
              onSuccess={handleAddEditSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, idx) => (
              <motion.tr
                key={product._id || product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.07 }}
                className="border-b border-gray-200 hover:bg-accent transition-colors duration-150"
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0].url
                        : ""
                    }
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-md border border-gray-200 shadow-sm"
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {product.name}
                </TableCell>
                <TableCell className="font-semibold text-indigo-600">
                  {typeof product.price === "number"
                    ? `$${product.price}`
                    : product.price}
                </TableCell>
                <TableCell className="flex gap-2">
                  <button
                    className={actionBtnStyle}
                    title="Edit"
                    onClick={() => {
                      setEditProduct(product);
                      setEditDialogOpen(true);
                    }}
                  >
                    <FaEdit size={16} />
                  </button>
                  <AlertDialog
                    open={openDeleteId === (product._id || product.id)}
                    onOpenChange={(open) =>
                      setOpenDeleteId(open ? product._id || product.id : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <button
                        className={actionBtnStyle + " hover:text-red-600"}
                        title="Delete"
                        onClick={() =>
                          setOpenDeleteId(product._id || product.id)
                        }
                      >
                        <FaTrash size={16} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this product?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={deletingId === (product._id || product.id)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            onClick={() =>
                              handleDeleteProduct(product._id || product.id)
                            }
                            disabled={
                              deletingId === (product._id || product.id)
                            }
                          >
                            {deletingId === (product._id || product.id)
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Admin_Products;
