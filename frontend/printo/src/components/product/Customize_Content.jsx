import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card"; // shadcn
import { motion } from "framer-motion";
import {
  FaTshirt,
  FaPalette,
  FaRulerCombined,
  FaTag,
  FaBoxes,
  FaUser,
} from "react-icons/fa";

const Customize_Content = ({
  product,
  selectedColor,
  setSelectedColor = () => {},
  selectedSize,
  setSelectedSize = () => {},
}) => {
  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-[60vh]"
    >
      <Card className="w-full max-w-xl shadow-lg border border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FaTshirt className="text-2xl text-gray-700" />
            <h2 className="text-2xl font-bold">{product.name}</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{product.description}</p>
          {/* Color Selector */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <FaPalette className="text-lg text-gray-500" />
              <span className="font-medium">Choose Color:</span>
            </div>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                    ${
                      selectedColor === color
                        ? "border-blue-600 ring-2 ring-blue-300"
                        : "border-gray-300"
                    }
                  `}
                  style={{
                    background:
                      color.toLowerCase() === "gray"
                        ? "linear-gradient(135deg, #e5e7eb 60%, #6b7280 100%)"
                        : color.toLowerCase(),
                  }}
                  aria-label={color}
                >
                  {selectedColor === color && (
                    <span className="text-xs text-blue-700 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Size Selector */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <FaRulerCombined className="text-lg text-gray-500" />
              <span className="font-medium">Choose Size:</span>
            </div>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded border
                    ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }
                    font-semibold transition
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FaTag className="text-lg text-gray-500" />
              <span className="font-medium">Price:</span>
              <span className="ml-1">${product.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBoxes className="text-lg text-gray-500" />
              <span className="font-medium">Stock:</span>
              <span className="ml-1">{product.stock}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTag className="text-lg text-gray-500" />
              <span className="font-medium">Category:</span>
              <span className="ml-1 capitalize">{product.category}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Customize_Content;
