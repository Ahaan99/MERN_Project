// Utility functions for responsive positioning
export const calculateRelativePosition = (x, y, containerWidth, containerHeight) => ({
  relativeX: (x / containerWidth) * 100,
  relativeY: (y / containerHeight) * 100
});

export const calculateAbsolutePosition = (relativeX, relativeY, containerWidth, containerHeight) => ({
  x: (relativeX * containerWidth) / 100,
  y: (relativeY * containerHeight) / 100
});

// Mouse event handlers for drag
export const handleMouseDown = (
  e,
  text,
  editingId,
  dragInfo,
  onMoveText,
  handleMouseMove,
  handleMouseUp,
  containerRef
) => {
  if (editingId === text.id) return;
  const rect = containerRef.current.getBoundingClientRect();
  dragInfo.current = {
    id: text.id,
    offsetX: e.clientX - (text.relativeX * rect.width / 100),
    offsetY: e.clientY - (text.relativeY * rect.height / 100),
    containerWidth: rect.width,
    containerHeight: rect.height
  };
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};

export const handleMouseMove = (e, dragInfo, onMoveText) => {
  const { id, offsetX, offsetY, containerWidth, containerHeight } = dragInfo.current;
  if (!id) return;
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  const { relativeX, relativeY } = calculateRelativePosition(x, y, containerWidth, containerHeight);
  if (onMoveText) onMoveText(id, relativeX, relativeY);
};

export const handleMouseUp = (dragInfo, handleMouseMove, handleMouseUp) => {
  dragInfo.current = { id: null, offsetX: 0, offsetY: 0 };
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
};

// Edit text
export const handleDoubleClick = (id, setEditingId) => {
  setEditingId(id);
};

export const handleInputBlur = (setEditingId) => {
  setEditingId(null);
};

export const handleInputChange = (id, e, onEditText) => {
  if (onEditText) onEditText(id, e.target.value);
};

// Image upload handlers
export const handleImageUpload = async (file) => {
  if (!file) return null;

  // Create a URL for the uploaded image
  const imageUrl = URL.createObjectURL(file);

  // Get image dimensions
  const img = new Image();
  img.src = imageUrl;
  
  return new Promise((resolve) => {
    img.onload = () => {
      // Calculate initial size (max 200px width/height while maintaining aspect ratio)
      const maxSize = 200;
      let width = img.width;
      let height = img.height;
      
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else {
          width = (width / height) * maxSize;
          height = maxSize;
        }
      }

      // Return the image data with relative width/height
      resolve({
        type: 'image',
        url: imageUrl,
        width: (width / maxSize) * 30, // Convert to relative width (percentage)
        height: (height / maxSize) * 30, // Convert to relative height (percentage)
        relativeX: 50,
        relativeY: 50
      });
    };
  });
};

// Drag handlers for elements
export const handleElementMouseDown = (
  e,
  el,
  elementDragInfo,
  handleElementMouseMove,
  handleElementMouseUp,
  containerRef
) => {
  e.stopPropagation();
  const rect = containerRef.current.getBoundingClientRect();
  elementDragInfo.current = {
    id: el.id,
    offsetX: e.clientX - (el.relativeX * rect.width / 100),
    offsetY: e.clientY - (el.relativeY * rect.height / 100),
    containerWidth: rect.width,
    containerHeight: rect.height
  };
  window.addEventListener("mousemove", handleElementMouseMove);
  window.addEventListener("mouseup", handleElementMouseUp);
};

export const handleElementMouseMove = (e, elementDragInfo, onMoveElement) => {
  const { id, offsetX, offsetY, containerWidth, containerHeight } = elementDragInfo.current;
  if (!id) return;
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  const { relativeX, relativeY } = calculateRelativePosition(x, y, containerWidth, containerHeight);
  if (onMoveElement) onMoveElement(id, relativeX, relativeY);
};

export const handleElementMouseUp = (elementDragInfo, handleElementMouseMove, handleElementMouseUp) => {
  window.removeEventListener("mousemove", handleElementMouseMove);
  window.removeEventListener("mouseup", handleElementMouseUp);
  elementDragInfo.current = { id: null, offsetX: 0, offsetY: 0, containerWidth: 0, containerHeight: 0 };
};

// Resize handlers for elements
export const handleResizeMouseDown = (
  e,
  el,
  setShowToolbarFor,
  elementResizeInfo,
  handleResizeMouseMove,
  handleResizeMouseUp,
  containerRef
) => {
  e.stopPropagation();
  setShowToolbarFor(null);
  const rect = containerRef.current.getBoundingClientRect();
  elementResizeInfo.current = {
    id: el.id,
    startX: e.clientX,
    startY: e.clientY,
    startW: el.width || 10,
    startH: el.height || 10,
    containerWidth: rect.width,
    containerHeight: rect.height
  };
  window.addEventListener("mousemove", handleResizeMouseMove);
  window.addEventListener("mouseup", handleResizeMouseUp);
};

export const handleResizeMouseMove = (
  e,
  elementResizeInfo,
  onResizeElement
) => {
  const { id, startX, startY, startW, startH, containerWidth, containerHeight } = elementResizeInfo.current;
  if (!id) return;
  const deltaX = ((e.clientX - startX) / containerWidth) * 100;
  const deltaY = ((e.clientY - startY) / containerHeight) * 100;
  const newW = Math.max(5, startW + deltaX); // Minimum 5% width
  const newH = Math.max(5, startH + deltaY); // Minimum 5% height
  if (onResizeElement) onResizeElement(id, { width: newW, height: newH });
};

export const handleResizeMouseUp = (
  elementResizeInfo,
  handleResizeMouseMove,
  handleResizeMouseUp
) => {
  elementResizeInfo.current = {
    id: null,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  };
  window.removeEventListener("mousemove", handleResizeMouseMove);
  window.removeEventListener("mouseup", handleResizeMouseUp);
};

// Helper to check if element can move in z-order
export const getZOrderState = (item, elements, texts, images = []) => {
  // Combine elements, texts, and images into a single array for z-index comparison
  const allItems = [
    ...(elements || []).map(e => ({ ...e, zIndex: e.zIndex || 1 })),
    ...(texts || []).map(t => ({ ...t, zIndex: t.zIndex || 1 })),
    ...(images || []).map(i => ({ ...i, zIndex: i.zIndex || 1 }))
  ].sort((a, b) => a.zIndex - b.zIndex);

  if (allItems.length < 2) {
    return {
      canBringForward: false,
      canBringToFront: false,
      canSendBackward: false,
      canSendToBack: false,
      showLayerOption: false,
    };
  }

  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const isTopMost = currentIndex === allItems.length - 1;
  const isBottomMost = currentIndex === 0;

  return {
    canBringForward: !isTopMost,
    canBringToFront: !isTopMost,
    canSendBackward: !isBottomMost,
    canSendToBack: !isBottomMost,
    showLayerOption: true,
  };
};
