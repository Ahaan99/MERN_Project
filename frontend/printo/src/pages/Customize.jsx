import Customize_Header from "@/components/product/Customize_Header";
import Customize_Sidebar from "@/components/product/Customize_Sidebar";
import Customize from "@/components/product/Customize";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { handleImageUpload } from "@/components/product/Customize_image_Utils";

const CustomizePage = () => {
  const location = useLocation();
  const product = location.state?.product;

  // State for selected side (front/back)
  const [side, setSide] = useState("front");

  // State for texts to add to the image
  const [texts, setTexts] = useState([]);

  // State for elements to add to the image
  const [elements, setElements] = useState([]);

  // State for uploaded images
  const [images, setImages] = useState([]);

  // Track selected text for sidebar editing
  const [selectedTextId, setSelectedTextId] = useState(null);
  // Track selected element for movement/resizing/deletion
  const [selectedElementId, setSelectedElementId] = useState(null);

  const handleAddText = (style = {}) => {
    setTexts((prev) => [
      ...prev,
      {
        id: Date.now(),
        value: style.value || "Sample Text",
        x: 50,
        y: 50,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        color: style.color,
      },
    ]);
  };

  // Add element with zIndex
  const handleAddElement = (element) => {
    setElements((prev) => [
      ...prev,
      {
        ...element,
        id: Date.now(),
        x: 80,
        y: 80,
        zIndex: prev.length
          ? Math.max(...prev.map((e) => e.zIndex || 1)) + 1
          : 1,
      },
    ]);
  };

  // Handle image upload
  const handleAddImage = async (file) => {
    try {
      const imageData = await handleImageUpload(file);
      if (!imageData) return;

      setImages(prev => [
        ...prev,
        {
          ...imageData,
          id: Date.now(),
          x: 50,
          y: 50,
          zIndex: prev.length
            ? Math.max(...prev.map((img) => img.zIndex || 1)) + 1
            : 1,
          width: imageData.width || 100,
          height: imageData.height || 100,
          type: 'image'
        }
      ]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Move image by id
  const handleMoveImage = (id, x, y) => {
    setImages(prev => 
      prev.map(img => img.id === id ? { ...img, x, y } : img)
    );
  };

  // Resize image by id
  const handleResizeImage = (id, size) => {
    setImages(prev =>
      prev.map(img => img.id === id ? { ...img, ...size } : img)
    );
  };

  // Delete image by id
  const handleDeleteImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // Move text by id
  const handleMoveText = (id, x, y) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
  };

  // Edit text value by id
  const handleEditText = (id, value) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, value } : t)));
  };

  // Delete text by id
  const handleDeleteText = (id) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
  };

  // Update text style by id
  const handleUpdateTextStyle = (id, style) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, ...style } : t)));
  };

  // Update text properties by id
  const handleUpdateText = (id, updates) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  // Move element by id
  const handleMoveElement = (id, x, y) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  // Resize element by id
  const handleResizeElement = (id, size) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...size } : el))
    );
  };

  // Delete element by id
  const handleDeleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // Z-index management functions
  const handleBringForward = (id) => {
    // Find which array contains the item
    const isText = texts.find(t => t.id === id);
    const isElement = elements.find(e => e.id === id);
    const isImage = images.find(i => i.id === id);

    // Get all items sorted by z-index
    const allItems = [
      ...texts.map(t => ({ ...t, type: 'text' })),
      ...elements.map(e => ({ ...e, type: 'element' })),
      ...images.map(i => ({ ...i, type: 'image' }))
    ].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    const currentIndex = allItems.findIndex(item => item.id === id);
    if (currentIndex < allItems.length - 1) {
      const nextItem = allItems[currentIndex + 1];
      const newZIndex = nextItem.zIndex + 1;

      // Update the appropriate state array
      if (isText) {
        setTexts(prev => prev.map(t => 
          t.id === id ? { ...t, zIndex: newZIndex } : t
        ));
      } else if (isElement) {
        setElements(prev => prev.map(e => 
          e.id === id ? { ...e, zIndex: newZIndex } : e
        ));
      } else if (isImage) {
        setImages(prev => prev.map(i => 
          i.id === id ? { ...i, zIndex: newZIndex } : i
        ));
      }
    }
  };

  const handleSendBackward = (id) => {
    // Find which array contains the item
    const isText = texts.find(t => t.id === id);
    const isElement = elements.find(e => e.id === id);
    const isImage = images.find(i => i.id === id);

    // Get all items sorted by z-index
    const allItems = [
      ...texts.map(t => ({ ...t, type: 'text' })),
      ...elements.map(e => ({ ...e, type: 'element' })),
      ...images.map(i => ({ ...i, type: 'image' }))
    ].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    const currentIndex = allItems.findIndex(item => item.id === id);
    if (currentIndex > 0) {
      const prevItem = allItems[currentIndex - 1];
      const newZIndex = prevItem.zIndex - 1;

      // Update the appropriate state array
      if (isText) {
        setTexts(prev => prev.map(t => 
          t.id === id ? { ...t, zIndex: newZIndex } : t
        ));
      } else if (isElement) {
        setElements(prev => prev.map(e => 
          e.id === id ? { ...e, zIndex: newZIndex } : e
        ));
      } else if (isImage) {
        setImages(prev => prev.map(i => 
          i.id === id ? { ...i, zIndex: newZIndex } : i
        ));
      }
    }
  };

  const handleBringToFront = (id) => {
    // Find which array contains the item
    const isText = texts.find(t => t.id === id);
    const isElement = elements.find(e => e.id === id);
    const isImage = images.find(i => i.id === id);

    // Get maximum z-index from all items
    const allZIndices = [
      ...texts.map(t => t.zIndex || 0),
      ...elements.map(e => e.zIndex || 0),
      ...images.map(i => i.zIndex || 0)
    ];
    const maxZIndex = Math.max(...allZIndices);
    const newZIndex = maxZIndex + 1;

    // Update the appropriate state array
    if (isText) {
      setTexts(prev => prev.map(t => 
        t.id === id ? { ...t, zIndex: newZIndex } : t
      ));
    } else if (isElement) {
      setElements(prev => prev.map(e => 
        e.id === id ? { ...e, zIndex: newZIndex } : e
      ));
    } else if (isImage) {
      setImages(prev => prev.map(i => 
        i.id === id ? { ...i, zIndex: newZIndex } : i
      ));
    }
  };

  const handleSendToBack = (id) => {
    // Find which array contains the item
    const isText = texts.find(t => t.id === id);
    const isElement = elements.find(e => e.id === id);
    const isImage = images.find(i => i.id === id);

    // Get minimum z-index from all items
    const allZIndices = [
      ...texts.map(t => t.zIndex || 0),
      ...elements.map(e => e.zIndex || 0),
      ...images.map(i => i.zIndex || 0)
    ];
    const minZIndex = Math.min(...allZIndices);
    const newZIndex = minZIndex - 1;

    // Update the appropriate state array
    if (isText) {
      setTexts(prev => prev.map(t => 
        t.id === id ? { ...t, zIndex: newZIndex } : t
      ));
    } else if (isElement) {
      setElements(prev => prev.map(e => 
        e.id === id ? { ...e, zIndex: newZIndex } : e
      ));
    } else if (isImage) {
      setImages(prev => prev.map(i => 
        i.id === id ? { ...i, zIndex: newZIndex } : i
      ));
    }
  };

  // Get selected text object
  const selectedText = texts.find((t) => t.id === selectedTextId) || null;

  return (
    <div className="flex h-screen">
      <Customize_Sidebar
        onAddText={handleAddText}
        expandedText={selectedText}
        onUpdateTextStyle={handleUpdateTextStyle}
        onAddElement={handleAddElement}
        onImageUpload={handleAddImage}
      />
      <div className="flex-1 flex flex-col">
        <Customize_Header side={side} setSide={setSide} />
        <div className="flex-1 bg-gray-100 p-8">
          <Customize
            product={product}
            side={side}
            texts={texts}
            elements={elements}
            images={images}
            onMoveText={handleMoveText}
            onEditText={handleEditText}
            onDeleteText={handleDeleteText}
            onSelectText={setSelectedTextId}
            onMoveElement={handleMoveElement}
            onResizeElement={handleResizeElement}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onDeleteElement={handleDeleteElement}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
            onUpdateText={handleUpdateText}
            onAddImage={handleAddImage}
            onMoveImage={handleMoveImage}
            onResizeImage={handleResizeImage}
            onDeleteImage={handleDeleteImage}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
