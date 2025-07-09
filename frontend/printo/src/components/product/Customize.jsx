import React, { useState } from "react";
import Customize_Content from "./Customize_Content";
import Customize_image from "./Customize_image";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import productApi from "@/api/productApi";

// Helper: get image by color and side
function getImageByColorAndSide(product, color, side = "front") {
  if (!product || !product.images || !product.colors) return "";
  const colorIdx = product.colors.findIndex(
    (c) => c.toLowerCase() === color.toLowerCase()
  );
  // If images are [front0, back0, front1, back1, ...] (not guaranteed), you may need to adjust this logic.
  // Here, assume images[0] = front, images[1] = back.
  if (side === "back" && product.images[1]) {
    return product.images[1].url;
  }
  return product.images[0]?.url || "";
}

// Helper to get all items sorted by z-index
const getSortedItems = (elements, texts, images) => {
  return [...elements, ...texts, ...images]
    .map((item) => ({
      ...item,
      isElement: "shape" in item,
      isImage: "url" in item,
      zIndex: item.zIndex || 1,
    }))
    .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));
};

const Customize = ({
  product,
  side = "front",
  texts = [],
  elements = [],
  images: imagesProp = [],
  onMoveText,
  onEditText,
  onDeleteText,
  onSelectText,
  onMoveElement,
  onResizeElement,
  selectedElementId,
  onSelectElement,
  onDeleteElement,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onUpdateText,
  onAddImage,
  onMoveImage,
  onResizeImage,
  onDeleteImage,
}) => {
  const { user, setTotalItemsInCart } = useAuth();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const imageUrl = getImageByColorAndSide(product, selectedColor, side);

  // Convert relative sizes to percentages for elements and images
  const processedElements = elements.map((el) => ({
    ...el,
    width: el.width || 10, // Default to 10% if not set
    height: el.height || 10,
    relativeX: el.relativeX || el.x || 50, // Default to center if not set
    relativeY: el.relativeY || el.y || 50,
  }));

  // --- ADD THIS: Local state for images if not managed by parent ---
  const [images, setImages] = useState(imagesProp);

  // Keep local images in sync with prop changes (optional, for controlled usage)
  React.useEffect(() => {
    setImages(imagesProp);
  }, [imagesProp]);

  // --- ADD THIS: Handler to update image position ---
  const handleMoveImage = (id, relativeX, relativeY) => {
    setImages((imgs) =>
      imgs.map((img) =>
        img.id === id ? { ...img, relativeX, relativeY } : img
      )
    );
  };

  const processedImages = images.map((img) => ({
    ...img,
    width: img.width || 20, // Default to 20% if not set
    height: img.height || 20,
    relativeX: img.relativeX || img.x || 50, // Default to center if not set
    relativeY: img.relativeY || img.y || 50,
  }));

  const processedTexts = texts.map((text) => ({
    ...text,
    relativeX: text.relativeX || text.x || 50, // Default to center if not set
    relativeY: text.relativeY || text.y || 50,
  }));

  // Generic function to update z-index
  const updateItemZIndex = (id, newZIndex) => {
    const isElement = elements.some((e) => e.id === id);
    const isImage = images.some((img) => img.id === id);

    if (isElement) {
      if (newZIndex > 0) {
        onBringForward(id, newZIndex);
      } else {
        onSendBackward(id, newZIndex);
      }
    } else if (isImage) {
      if (newZIndex > 0) {
        onBringForward(id, newZIndex);
      } else {
        onSendBackward(id, newZIndex);
      }
    } else {
      onUpdateText(id, { zIndex: newZIndex });
    }
  };

  const handleBringForward = (id) => {
    const sortedItems = getSortedItems(
      processedElements,
      processedTexts,
      processedImages
    );
    const currentIndex = sortedItems.findIndex((item) => item.id === id);

    if (currentIndex < sortedItems.length - 1) {
      const currentItem = sortedItems[currentIndex];
      const nextItem = sortedItems[currentIndex + 1];
      const newZIndex = nextItem.zIndex + 1;
      updateItemZIndex(id, newZIndex);
    }
  };

  const handleSendBackward = (id) => {
    const sortedItems = getSortedItems(
      processedElements,
      processedTexts,
      processedImages
    );
    const currentIndex = sortedItems.findIndex((item) => item.id === id);

    if (currentIndex > 0) {
      const currentItem = sortedItems[currentIndex];
      const prevItem = sortedItems[currentIndex - 1];
      const newZIndex = prevItem.zIndex - 1;
      updateItemZIndex(id, newZIndex);
    }
  };

  const handleBringToFront = (id) => {
    const sortedItems = getSortedItems(
      processedElements,
      processedTexts,
      processedImages
    );
    const maxZIndex = Math.max(...sortedItems.map((item) => item.zIndex));
    updateItemZIndex(id, maxZIndex + 1);
  };

  const handleSendToBack = (id) => {
    const sortedItems = getSortedItems(
      processedElements,
      processedTexts,
      processedImages
    );
    const minZIndex = Math.min(...sortedItems.map((item) => item.zIndex));
    updateItemZIndex(id, minZIndex - 1);
  };

  const handleAddToCart = async () => {
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

    // Prepare customization data
    const customization = {
      texts: processedTexts.map(text => ({
        value: text.value,
        fontFamily: text.fontFamily,
        fontSize: text.fontSize,
        color: text.color,
        relativeX: text.relativeX,
        relativeY: text.relativeY,
        zIndex: text.zIndex || 1
      })),
      elements: processedElements.map(element => ({
        shape: element.shape,
        color: element.color,
        width: element.width,
        height: element.height,
        relativeX: element.relativeX,
        relativeY: element.relativeY,
        zIndex: element.zIndex || 1
      })),
      images: processedImages.map(image => ({
        url: image.url,
        width: image.width,
        height: image.height,
        relativeX: image.relativeX,
        relativeY: image.relativeY,
        zIndex: image.zIndex || 1
      }))
    };

    const itemData = {
      productId: product._id,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      customization
    };

    try {
      await productApi.post(`/${user._id}/add-to-cart`, itemData);
      setTotalItemsInCart(prev => prev + 1);
      toast.success("Customized product added to cart!");
      navigate("/user/cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex min-[1280px]:flex-row">
        <div className="flex-1">
          <Customize_image
            imageUrl={imageUrl}
            color={selectedColor}
            texts={processedTexts}
            elements={processedElements}
            images={processedImages}
            onMoveText={onMoveText}
            onEditText={onEditText}
            onDeleteText={onDeleteText}
            onSelectText={onSelectText}
            onMoveElement={onMoveElement}
            onResizeElement={onResizeElement}
            selectedElementId={selectedElementId}
            onSelectElement={onSelectElement}
            onDeleteElement={onDeleteElement}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
            onMoveImage={handleMoveImage}
            onResizeImage={onResizeImage}
            onDeleteImage={onDeleteImage}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <Customize_Content
            product={product}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
          <Button onClick={handleAddToCart}>Add To Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default Customize;
