import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FiLayers,
  FiChevronUp,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiMoreVertical,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { MdOutlineFrontHand, MdOutlineFlipToBack } from "react-icons/md";
import {
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleDoubleClick,
  handleInputBlur,
  handleInputChange,
  handleElementMouseDown,
  handleElementMouseMove,
  handleElementMouseUp,
  handleResizeMouseDown,
  handleResizeMouseMove,
  handleResizeMouseUp,
  getZOrderState,
} from "./Customize_image_Utils";

const ZIndexToolbar = ({
  onBringForward,
  onBringToFront,
  onSendBackward,
  onSendToBack,
  showLayers,
  setShowLayers,
  canBringForward,
  canBringToFront,
  canSendBackward,
  canSendToBack,
  showLayerOption,
}) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="absolute top-[-8px] left-[60px] z-[100]"
    >
      <Card className="min-w-[180px] shadow-lg p-0">
        <CardContent className="flex flex-col gap-0 p-0">
          <button
            type="button"
            onClick={onBringForward}
            disabled={!canBringForward}
            className={`flex items-center gap-2 w-full px-4 py-2 bg-transparent border-0 text-[15px] outline-none transition-colors ${
              canBringForward
                ? "text-slate-800 hover:bg-slate-100 cursor-pointer"
                : "text-slate-400 cursor-not-allowed"
            }`}
          >
            <FiChevronUp className="text-lg" />
            Bring forward
            <span className="ml-auto text-xs text-slate-500">Ctrl+]</span>
          </button>
          <button
            type="button"
            onClick={onBringToFront}
            disabled={!canBringToFront}
            className={`flex items-center gap-2 w-full px-4 py-2 bg-transparent border-0 text-[15px] outline-none transition-colors ${
              canBringToFront
                ? "text-slate-800 hover:bg-slate-100 cursor-pointer"
                : "text-slate-400 cursor-not-allowed"
            }`}
          >
            <MdOutlineFrontHand className="text-lg" />
            Bring to front
            <span className="ml-auto text-xs text-slate-500">Ctrl+Alt+]</span>
          </button>
          <button
            type="button"
            onClick={onSendBackward}
            disabled={!canSendBackward}
            className={`flex items-center gap-2 w-full px-4 py-2 bg-transparent border-0 text-[15px] outline-none transition-colors ${
              canSendBackward
                ? "text-slate-800 hover:bg-slate-100 cursor-pointer"
                : "text-slate-400 cursor-not-allowed"
            }`}
          >
            <FiChevronDown className="text-lg" />
            Send backward
            <span className="ml-auto text-xs text-slate-500">Ctrl+[</span>
          </button>
          <button
            type="button"
            onClick={onSendToBack}
            disabled={!canSendToBack}
            className={`flex items-center gap-2 w-full px-4 py-2 bg-transparent border-0 text-[15px] outline-none transition-colors ${
              canSendToBack
                ? "text-slate-800 hover:bg-slate-100 cursor-pointer"
                : "text-slate-400 cursor-not-allowed"
            }`}
          >
            <MdOutlineFlipToBack className="text-lg" />
            Send to back
            <span className="ml-auto text-xs text-slate-500">Ctrl+Alt+[</span>
          </button>
          {showLayerOption && (
            <>
              <div className="border-t border-slate-200 my-2" />
              <button
                type="button"
                onClick={() => setShowLayers(true)}
                className="flex items-center gap-2 w-full px-4 py-2 bg-transparent border-0 text-[15px] text-slate-800 hover:bg-slate-100 cursor-pointer outline-none"
              >
                <FiLayers className="text-lg" />
                Show layers
                <span className="ml-auto text-xs text-slate-500">Alt+1</span>
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  </AnimatePresence>
);

const Customize_image = ({
  imageUrl,
  color = "#fff",
  texts = [],
  elements = [],
  images = [],
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
  onMoveImage,
  onResizeImage,
  onDeleteImage,
  readOnly = false,
}) => {
  const overlayRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // State for container dimensions
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Update container dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate font size based on container width
  const calculateFontSize = (baseFontSize) => {
    const baseWidth = 500; // Base width for scaling
    const scale = containerDimensions.width / baseWidth;
    return Math.max(12, Math.round(baseFontSize * scale)); // Minimum 12px
  };

  // State for width/height (fixed, no resizing)
  const [size] = useState({ width: 300, height: 300 });

  // Only keep one declaration for showLayers and showToolbarFor
  const [showLayers, setShowLayers] = useState(false);
  const [showToolbarFor, setShowToolbarFor] = useState(null);

  const [selectedTextId, setSelectedTextId] = useState(null);
  const [showTextToolbarFor, setShowTextToolbarFor] = useState(null);

  // Add this state near the top of the component
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    startRelativeX: 0,
    startRelativeY: 0,
  });

  useEffect(() => {
    if (overlayRef.current && imgRef.current) {
      overlayRef.current.style.webkitMaskImage = `url(${imgRef.current.src})`;
      overlayRef.current.style.maskImage = `url(${imgRef.current.src})`;
      overlayRef.current.style.webkitMaskRepeat = "no-repeat";
      overlayRef.current.style.maskRepeat = "no-repeat";
      overlayRef.current.style.webkitMaskSize = "100% 100%";
      overlayRef.current.style.maskSize = "100% 100%";
    }
  }, [imageUrl, size]);

  // Track which text is being edited
  const [editingId, setEditingId] = useState(null);

  // Drag state
  const dragInfo = useRef({ id: null, offsetX: 0, offsetY: 0 });
  // Drag state for elements
  const elementDragInfo = useRef({ id: null, offsetX: 0, offsetY: 0 });
  // Resize state for elements
  const elementResizeInfo = useRef({
    id: null,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  // Deselect element when clicking outside
  useEffect(() => {
    const handleDeselect = (e) => {
      if (containerRef.current && e.target === containerRef.current) {
        setSelectedTextId(null);
        if (onSelectElement) onSelectElement(null);
        setShowToolbarFor(null);
      }
    };
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener("mousedown", handleDeselect);
    }
    return () => {
      if (ref) {
        ref.removeEventListener("mousedown", handleDeselect);
      }
    };
  }, [onSelectElement]);

  // Hide layers panel when element is deselected
  useEffect(() => {
    if (!selectedElementId) {
      setShowLayers(false);
      setShowToolbarFor(null); // Also close toolbar when nothing is selected
    }
  }, [selectedElementId]);

  // Combine and sort all items by z-index
  const renderItems = [
    ...elements.map((el) => ({ ...el, type: "element" })),
    ...texts.map((text) => ({ ...text, type: "text" })),
    ...images.map((img) => ({ ...img, type: "image" })),
  ].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

  const handleTextClick = (e, text) => {
    e.stopPropagation();
    setSelectedTextId(text.id);
    if (onSelectText) onSelectText(text.id);
  };

  // Add this useEffect after the other useEffects
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!dragState.isDragging) return;

      const deltaXPercent =
        ((e.clientX - dragState.startX) / dragState.containerWidth) * 100;
      const deltaYPercent =
        ((e.clientY - dragState.startY) / dragState.containerHeight) * 100;

      const newRelativeX = Math.max(
        0,
        Math.min(100, dragState.startRelativeX + deltaXPercent)
      );
      const newRelativeY = Math.max(
        0,
        Math.min(100, dragState.startRelativeY + deltaYPercent)
      );

      if (onMoveImage) {
        onMoveImage(dragState.itemId, newRelativeX, newRelativeY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (dragState.isDragging) {
        setDragState({
          isDragging: false,
          startX: 0,
          startY: 0,
          startRelativeX: 0,
          startRelativeY: 0,
          itemId: null,
          containerWidth: 0,
          containerHeight: 0,
        });
      }
    };

    if (dragState.isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [dragState, onMoveImage]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block w-full h-auto"
      style={{ cursor: readOnly ? "default" : "move" }}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Customize Preview"
        className="block w-full h-full rounded-xl select-none pointer-events-none"
        draggable={false}
      />
      {/* Color overlay, clipped to hoodie only */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: color,
          opacity: 0.5,
        }}
      />
      {/* Render all items in z-index order */}
      {renderItems.map((item) => {
        if (item.type === "text") {
          return editingId === item.id ? (
            <input
              key={item.id}
              type="text"
              value={item.value}
              autoFocus
              onBlur={() => {
                handleInputBlur(setEditingId);
                setSelectedTextId(null);
                setShowTextToolbarFor(null);
              }}
              onChange={(e) => handleInputChange(item.id, e, onEditText)}
              className="absolute font-bold px-2 py-1 rounded border border-slate-300 bg-white/80 min-w-[60px]"
              style={{
                left: `${item.relativeX}%`,
                top: `${item.relativeY}%`,
                fontSize: `${calculateFontSize(item.fontSize || 22)}px`,
                color: item.color || "#222",
                fontFamily: item.fontFamily || "inherit",
                zIndex: item.zIndex || 1,
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              key={item.id}
              className={`absolute cursor-move group font-bold ${
                selectedTextId === item.id
                  ? "ring-2 ring-indigo-500 ring-offset-2"
                  : ""
              }`}
              style={{
                left: `${item.relativeX}%`,
                top: `${item.relativeY}%`,
                fontSize: `${calculateFontSize(item.fontSize || 22)}px`,
                color: item.color || "#222",
                fontFamily: item.fontFamily || "inherit",
                pointerEvents: readOnly ? "none" : "auto",
                userSelect: "none",
                zIndex: item.zIndex || 1,
                transform: "translate(-50%, -50%)",
              }}
              onMouseDown={(e) =>
                handleMouseDown(
                  e,
                  item,
                  editingId,
                  dragInfo,
                  onMoveText,
                  (e) => handleMouseMove(e, dragInfo, onMoveText),
                  () => handleMouseUp(dragInfo),
                  containerRef
                )
              }
              onDoubleClick={() => handleDoubleClick(item.id, setEditingId)}
              onClick={(e) => handleTextClick(e, item)}
            >
              {item.value}
              {selectedTextId === item.id && (
                <>
                  <Popover
                    open={showTextToolbarFor === item.id}
                    onOpenChange={(open) =>
                      setShowTextToolbarFor(open ? item.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="absolute bg-white flex items-center justify-center h-8 w-8 z-50 text-2xl -top-6 right-0 rounded-full shadow border border-slate-200"
                        title="More options"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FiMoreVertical />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" className="p-0">
                      <ZIndexToolbar
                        onBringForward={() =>
                          onBringForward && onBringForward(item.id)
                        }
                        onBringToFront={() =>
                          onBringToFront && onBringToFront(item.id)
                        }
                        onSendBackward={() =>
                          onSendBackward && onSendBackward(item.id)
                        }
                        onSendToBack={() =>
                          onSendToBack && onSendToBack(item.id)
                        }
                        showLayers={showLayers}
                        setShowLayers={setShowLayers}
                        {...getZOrderState(item, elements, texts, images)}
                      />
                    </PopoverContent>
                  </Popover>
                  {onDeleteText && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteText(item.id);
                        setSelectedTextId(null);
                        setShowTextToolbarFor(null);
                      }}
                      className="ml-2 absolute top-[-10px] left-[-22px] w-5 h-5 bg-white border border-slate-300 rounded-full text-[14px] cursor-pointer z-20 flex items-center justify-center opacity-80 hover:bg-red-50 hover:text-red-500 transition"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </>
              )}
            </div>
          );
        } else if (item.type === "image") {
          const isSelected = selectedElementId === item.id;
          const baseStyle = {
            position: "absolute",
            left: `${item.relativeX}%`,
            top: `${item.relativeY}%`,
            width: `${item.width}%`,
            height: `${item.height}%`,
            zIndex: item.zIndex || 1,
            opacity: 0.95,
            pointerEvents: readOnly ? "none" : "auto",
            boxSizing: "border-box",
            border: isSelected ? "2px solid #6366f1" : "none",
            background: "transparent",
            cursor: "move",
            transition: "border 0.15s",
            borderRadius: 8,
            overflow: "hidden",
            transform: "translate(-50%, -50%)",
          };

          return (
            <div
              key={item.id}
              style={baseStyle}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectElement) {
                  onSelectElement(item.id);
                  if (showToolbarFor && showToolbarFor !== item.id) {
                    setShowToolbarFor(null);
                  }
                }
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                const rect = containerRef.current.getBoundingClientRect();
                setDragState({
                  isDragging: true,
                  startX: e.clientX,
                  startY: e.clientY,
                  startRelativeX: item.relativeX || 50,
                  startRelativeY: item.relativeY || 50,
                  itemId: item.id,
                  containerWidth: rect.width,
                  containerHeight: rect.height,
                });
              }}
              onMouseMove={(e) => {
                if (!dragState.isDragging || dragState.itemId !== item.id)
                  return;

                e.stopPropagation();
                const deltaXPercent =
                  ((e.clientX - dragState.startX) / dragState.containerWidth) *
                  100;
                const deltaYPercent =
                  ((e.clientY - dragState.startY) / dragState.containerHeight) *
                  100;

                const newRelativeX = Math.max(
                  0,
                  Math.min(100, dragState.startRelativeX + deltaXPercent)
                );
                const newRelativeY = Math.max(
                  0,
                  Math.min(100, dragState.startRelativeY + deltaYPercent)
                );

                if (onMoveImage) {
                  onMoveImage(item.id, newRelativeX, newRelativeY);
                }
              }}
              onMouseUp={() => {
                if (dragState.itemId === item.id) {
                  setDragState({
                    isDragging: false,
                    startX: 0,
                    startY: 0,
                    startRelativeX: 0,
                    startRelativeY: 0,
                    itemId: null,
                    containerWidth: 0,
                    containerHeight: 0,
                  });
                }
              }}
              onMouseLeave={() => {
                if (dragState.itemId === item.id) {
                  setDragState({
                    isDragging: false,
                    startX: 0,
                    startY: 0,
                    startRelativeX: 0,
                    startRelativeY: 0,
                    itemId: null,
                    containerWidth: 0,
                    containerHeight: 0,
                  });
                }
              }}
            >
              <img
                src={item.url}
                alt="Uploaded"
                className="w-full h-full object-contain"
                draggable={false}
                style={{ pointerEvents: "none" }}
              />
              {isSelected && (
                <>
                  <Popover
                    open={showToolbarFor === item.id}
                    onOpenChange={(open) =>
                      setShowToolbarFor(open ? item.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="absolute bg-white flex items-center justify-center h-8 w-8 z-50 text-2xl -top-6 right-0 rounded-full shadow border border-slate-200"
                        title="More options"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FiMoreVertical />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" className="p-0">
                      <ZIndexToolbar
                        onBringForward={() =>
                          onBringForward && onBringForward(item.id)
                        }
                        onBringToFront={() =>
                          onBringToFront && onBringToFront(item.id)
                        }
                        onSendBackward={() =>
                          onSendBackward && onSendBackward(item.id)
                        }
                        onSendToBack={() =>
                          onSendToBack && onSendToBack(item.id)
                        }
                        showLayers={showLayers}
                        setShowLayers={setShowLayers}
                        {...getZOrderState(item, elements, texts, images)}
                      />
                    </PopoverContent>
                  </Popover>
                  <div
                    className="absolute right-[-8px] bottom-[-8px] w-4 h-4 bg-white border-2 border-indigo-500 rounded cursor-nwse-resize z-10 flex items-center justify-center shadow"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleResizeMouseDown(
                        e,
                        item,
                        setShowToolbarFor,
                        elementResizeInfo,
                        (e) =>
                          handleResizeMouseMove(
                            e,
                            elementResizeInfo,
                            onResizeImage
                          ),
                        () =>
                          handleResizeMouseUp(
                            elementResizeInfo,
                            (e) =>
                              handleResizeMouseMove(
                                e,
                                elementResizeInfo,
                                onResizeImage
                              ),
                            () => handleResizeMouseUp(elementResizeInfo)
                          ),
                        containerRef
                      );
                    }}
                  >
                    <div className="w-2 h-2 bg-indigo-500 rounded" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteImage) onDeleteImage(item.id);
                    }}
                    className="absolute top-[-10px] left-[-10px] w-5 h-5 bg-white border border-slate-300 rounded-full text-[14px] cursor-pointer z-20 flex items-center justify-center opacity-85 hover:bg-red-50 hover:text-red-500 transition"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </>
              )}
            </div>
          );
        } else {
          // Render element
          const width = item.width || 48;
          const height = item.height || 48;
          const isActive = selectedElementId === item.id;
          const baseStyle = {
            position: "absolute",
            left: `${item.relativeX}%`,
            top: `${item.relativeY}%`,
            zIndex: item.zIndex || 1,
            width: `${item.width}%`,
            height: `${item.height}%`,
            opacity: 0.95,
            pointerEvents: readOnly ? "none" : "auto",
            boxSizing: "border-box",
            border: isActive ? "2px solid #6366f1" : "none",
            background: "transparent",
            cursor: isActive ? "move" : "pointer",
            transition: "border 0.15s",
            borderRadius: 8,
            transform: "translate(-50%, -50%)",
          };

          let shapeNode = null;
          if (item.shape === "circle") {
            shapeNode = (
              <div
                className="w-full h-full rounded-full"
                style={{ background: item.color }}
              />
            );
          } else if (item.shape === "square") {
            shapeNode = (
              <div
                className="w-full h-full rounded-md"
                style={{ background: item.color }}
              />
            );
          } else if (item.shape === "triangle") {
            shapeNode = (
              <svg width="100%" height="100%">
                <polygon
                  points={`${width / 2},4 ${width - 4},${height - 4} 4,${
                    height - 4
                  }`}
                  fill={item.color}
                />
              </svg>
            );
          } else if (item.shape === "star") {
            shapeNode = (
              <svg width="100%" height="100%" viewBox="0 0 48 48">
                <polygon
                  points="24,4 29,34 4,18 44,18 19,34"
                  fill={item.color}
                />
              </svg>
            );
          } else if (item.shape === "heart") {
            shapeNode = (
              <svg width="100%" height="100%" viewBox="0 0 32 32">
                <path
                  d="M16 29s-13-8.35-13-16.5S8.5 2 16 9.5 29 2 29 12.5 16 29 16 29z"
                  fill={item.color}
                />
              </svg>
            );
          }

          const zOrderState = getZOrderState(item, elements, texts, images);

          return (
            <div
              key={item.id}
              style={baseStyle}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectElement) {
                  onSelectElement(item.id);
                  if (showToolbarFor && showToolbarFor !== item.id) {
                    setShowToolbarFor(null);
                  }
                }
              }}
              onMouseDown={
                isActive
                  ? (e) =>
                      handleElementMouseDown(
                        e,
                        item,
                        elementDragInfo,
                        (e) =>
                          handleElementMouseMove(
                            e,
                            elementDragInfo,
                            onMoveElement
                          ),
                        () =>
                          handleElementMouseUp(
                            elementDragInfo,
                            (e) =>
                              handleElementMouseMove(
                                e,
                                elementDragInfo,
                                onMoveElement
                              ),
                            () => handleElementMouseUp(elementDragInfo)
                          ),
                        containerRef
                      )
                  : undefined
              }
            >
              {shapeNode}
              {isActive && (
                <>
                  <Popover
                    open={showToolbarFor === item.id}
                    onOpenChange={(open) =>
                      setShowToolbarFor(open ? item.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="absolute bg-white flex items-center justify-center h-8 w-8 z-50 text-2xl -top-6 right-0 rounded-full shadow border border-slate-200"
                        title="More options"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FiMoreVertical />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" className="p-0">
                      <ZIndexToolbar
                        onBringForward={() =>
                          onBringForward && onBringForward(item.id)
                        }
                        onBringToFront={() =>
                          onBringToFront && onBringToFront(item.id)
                        }
                        onSendBackward={() =>
                          onSendBackward && onSendBackward(item.id)
                        }
                        onSendToBack={() =>
                          onSendToBack && onSendToBack(item.id)
                        }
                        showLayers={showLayers}
                        setShowLayers={setShowLayers}
                        {...zOrderState}
                      />
                    </PopoverContent>
                  </Popover>
                  <div
                    className="absolute right-[-8px] bottom-[-8px] w-4 h-4 bg-white border-2 border-indigo-500 rounded cursor-nwse-resize z-10 flex items-center justify-center shadow"
                    onMouseDown={(e) =>
                      handleResizeMouseDown(
                        e,
                        item,
                        setShowToolbarFor,
                        elementResizeInfo,
                        (e) =>
                          handleResizeMouseMove(
                            e,
                            elementResizeInfo,
                            onResizeElement
                          ),
                        () =>
                          handleResizeMouseUp(
                            elementResizeInfo,
                            (e) =>
                              handleResizeMouseMove(
                                e,
                                elementResizeInfo,
                                onResizeElement
                              ),
                            () => handleResizeMouseUp(elementResizeInfo)
                          ),
                        containerRef
                      )
                    }
                  >
                    <div className="w-2 h-2 bg-indigo-500 rounded" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteElement) onDeleteElement(item.id);
                    }}
                    className="absolute top-[-10px] left-[-10px] w-5 h-5 bg-white border border-slate-300 rounded-full text-[14px] cursor-pointer z-20 flex items-center justify-center opacity-85 hover:bg-red-50 hover:text-red-500 transition"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

export default Customize_image;
