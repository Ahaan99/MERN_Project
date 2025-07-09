import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "@/services/axios";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { sampleProducts } from "@/data/sampleProducts";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/context/AuthContext";
import productApi from "@/api/productApi";

export function Customize() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [product, setProduct] = useState(location.state?.product || null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [textControls, setTextControls] = useState({
    fontSize: 20,
    color: "#000000",
    fontFamily: "Arial",
  });
  const [selectedColor, setSelectedColor] = useState(
    location.state?.selectedColor || null
  );
  const [selectedSize, setSelectedSize] = useState(
    location.state?.selectedSize || null
  );
  const [canvasScale, setCanvasScale] = useState(1);
  const [productView, setProductView] = useState("front");
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);
  const addToCart = useCartStore((state) => state.addItem);
  const { user } = useAuth();
  const templateImages = location.state?.templateImages;

  const getCloudinaryUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder-product.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `https://res.cloudinary.com/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload/${imageUrl}`;
  };

  useEffect(() => {
    // If product is already in state (from navigation), skip fetching
    if (product) return;

    const loadProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        if (data) {
          setProduct(data);
          // Set default color and size if not already set
          if (!selectedColor && data.colors?.length > 0) {
            setSelectedColor(data.colors[0].hex);
          }
          if (!selectedSize && data.sizes?.length > 0) {
            setSelectedSize(data.sizes[0]);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
        // Try fallback to sample products
        const fallbackProduct = sampleProducts.find((p) => p._id === id);
        if (fallbackProduct) {
          setProduct(fallbackProduct);
          if (!selectedColor && fallbackProduct.colors?.length > 0) {
            setSelectedColor(fallbackProduct.colors[0].hex);
          }
          if (!selectedSize && fallbackProduct.sizes?.length > 0) {
            setSelectedSize(fallbackProduct.sizes[0]);
          }
        } else {
          toast.error("Product not found");
          navigate("/products");
        }
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, navigate, product]);

  useEffect(() => {
    if (!product) return;

    const canvas = new fabric.Canvas("canvas", {
      width: 600,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Show front image by default
    let imageUrl = product.images?.[0]?.url;
    if (imageUrl) {
      fabric.Image.fromURL(
        imageUrl,
        (img) => {
          const scale = Math.min(
            (canvas.width * 0.8) / img.width,
            (canvas.height * 0.8) / img.height
          );
          img.set({
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            customType: "template",
            originX: "center",
            originY: "center",
            crossOrigin: "anonymous",
          });
          canvas.add(img);
          img.center();
          canvas.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }

    canvas.on("object:modified", () => canvas.renderAll());
    setCanvas(canvas);

    return () => {
      canvas.dispose();
      setCanvas(null); // <-- Prevents using disposed canvas
    };
  }, [product]);

  useEffect(() => {
    if (!canvas || !product || !templateImages) return;

    const imageUrl =
      productView === "front"
        ? templateImages.front
        : templateImages.back || templateImages.front;

    // Clear existing template
    const existingTemplate = canvas
      .getObjects()
      .find((obj) => obj.customType === "template");
    if (existingTemplate) {
      canvas.remove(existingTemplate);
    }

    fabric.Image.fromURL(
      imageUrl,
      function (img) {
        const scale = Math.min(
          (canvas.width * 0.8) / img.width,
          (canvas.height * 0.8) / img.height
        );

        img.set({
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          customType: "template",
          originX: "center",
          originY: "center",
          crossOrigin: "anonymous",
        });
        canvas.add(img);
        img.center();
        canvas.renderAll();
      },
      { crossOrigin: "anonymous" }
    );
  }, [canvas, product, productView, templateImages]);

  useEffect(() => {
    if (canvas && selectedColor) {
      const template = canvas
        .getObjects()
        .find((obj) => obj.customType === "template");
      if (template) {
        template.filters = [
          new fabric.Image.filters.BlendColor({
            color: selectedColor,
            mode: "tint",
            alpha: 0.5,
          }),
        ];
        template.applyFilters();
        canvas.renderAll();
      }
    }
  }, [selectedColor]);

  const handleSelectionCreated = (e) => {
    const obj = e.selected[0];
    setSelectedObject(obj);
    if (obj instanceof fabric.IText) {
      setTextControls({
        fontSize: obj.fontSize,
        color: obj.fill,
        fontFamily: obj.fontFamily,
      });
    }
  };

  const handleSelectionCleared = () => {
    setSelectedObject(null);
  };

  const handleObjectMoving = (e) => {
    const obj = e.target;
    const bound = obj.getBoundingRect();
    if (
      bound.top < 0 ||
      bound.left < 0 ||
      bound.top + bound.height > canvas.height ||
      bound.left + bound.width > canvas.width
    ) {
      obj.setCoords();
      obj.set({
        left: Math.min(Math.max(obj.left, 0), canvas.width - bound.width),
        top: Math.min(Math.max(obj.top, 0), canvas.height - bound.height),
      });
    }
  };

  const handleObjectScaling = (e) => {
    const obj = e.target;
    if (obj.scaleX > 3) obj.scaleX = 3;
    if (obj.scaleY > 3) obj.scaleY = 3;
    obj.setCoords();
  };

  const handleAddText = () => {
    if (!canvas) return;
    const text = new fabric.IText("Your Text Here", {
      left: 100,
      top: 100,
      fontSize: textControls.fontSize,
      fill: textControls.color,
      fontFamily: textControls.fontFamily,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    setSelectedObject(text);
  };

  const updateTextProperty = (property, value) => {
    if (!selectedObject || !(selectedObject instanceof fabric.IText)) return;
    selectedObject.set(property, value);
    canvas?.renderAll();
    setTextControls((prev) => ({ ...prev, [property]: value }));
  };

  const handleUploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target?.result, (img) => {
        img.scaleToWidth(200);
        canvas?.add(img);
        canvas?.setActiveObject(img);
        setSelectedObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleObjectControls = (action) => {
    if (!selectedObject || !canvas) return;

    switch (action) {
      case "delete":
        canvas.remove(selectedObject);
        setSelectedObject(null);
        break;
      case "forward":
        selectedObject.bringForward();
        break;
      case "backward":
        selectedObject.sendBackwards();
        break;
      case "clone":
        selectedObject.clone((cloned) => {
          cloned.set({
            left: cloned.left + 10,
            top: cloned.top + 10,
          });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
        });
        break;
    }
    canvas.renderAll();
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/auth");
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color");
      return;
    }

    // Helper to export canvas as image
    const exportCanvasImage = (canvas) => {
      if (!canvas) return null;
      try {
        return canvas.toDataURL({
          format: "jpeg",
          quality: 0.5,
          width: 300,
          height: 300,
          multiplier: 300 / canvas.width,
        });
      } catch {
        return null;
      }
    };

    let design = null;
    let frontImage = null;
    let backImage = null;

    if (canvas) {
      try {
        design = canvas.toJSON(["customType"]);
        // Save current view
        const originalView = productView;

        // Export front image
        if (productView !== "front") {
          setProductView("front");
          await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for canvas to update
        }
        frontImage = exportCanvasImage(canvas);

        // Export back image
        setProductView("back");
        await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for canvas to update
        backImage = exportCanvasImage(canvas);

        // Restore original view
        setProductView(originalView);
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (e) {
        frontImage = product.images?.[0]?.url;
        backImage = product.images?.[1]?.url || product.images?.[0]?.url;
      }
    }

    const itemData = {
      productId: product._id,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      customization: {
        design,
        frontImage,
        backImage,
      },
    };

    // Log the data being sent to the backend
    console.log("[Add to Cart] Data sent:", itemData);

    try {
      await productApi.post(`/${user._id}/add-to-cart`, itemData);
      // Fetch updated cart from backend
      const { data: updatedCart } = await productApi.get(`/${user._id}/cart`);
      // Update your cart store/state here, e.g.:
      // setCart(updatedCart); // if you have a setCart function
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

  const handleZoom = (delta) => {
    const newScale = Math.min(Math.max(canvasScale + delta, 0.5), 2);
    setCanvasScale(newScale);
    canvas?.setZoom(newScale);
    canvas?.renderAll();
  };

  const handleRotateView = () => {
    if (!product || !canvas) return;

    const view = productView === "front" ? "back" : "front";
    setProductView(view);

    const designElements = canvas
      .getObjects()
      .filter((obj) => obj.customType !== "template");

    canvas.clear();

    // Use images[0] for front, images[1] for back (fallback to images[0] if not present)
    let imageUrl;
    if (view === "front") {
      imageUrl = product.images?.[0]?.url;
    } else {
      imageUrl = product.images?.[1]?.url || product.images?.[0]?.url;
    }

    if (imageUrl) {
      fabric.Image.fromURL(
        imageUrl,
        function (img) {
          const scale = Math.min(
            (canvas.width * 0.8) / img.width,
            (canvas.height * 0.8) / img.height
          );
          img.set({
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            customType: "template",
            originX: "center",
            originY: "center",
            crossOrigin: "anonymous",
          });
          canvas.add(img);
          img.center();
          designElements.forEach((element) => {
            canvas.add(element);
          });
          canvas.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }
  };

  const controls = [
    {
      label: "View",
      buttons: [
        { icon: "👕", text: "Front", value: "front" },
        { icon: "👔", text: "Back", value: "back" },
      ],
    },
    {
      label: "Canvas",
      buttons: [
        { icon: "🔍", text: "Zoom In", action: () => handleZoom(0.1) },
        { icon: "🔎", text: "Zoom Out", action: () => handleZoom(-0.1) },
        { icon: "↺", text: "Reset", action: () => setCanvasScale(1) },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-8">
          {controls.map((group) => (
            <div key={group.label} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500">
                {group.label}:
              </span>
              <div className="flex gap-2">
                {group.buttons.map((btn) => (
                  <Button
                    key={btn.text}
                    variant={btn.value === productView ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (btn.value) {
                        setProductView(btn.value);
                        handleRotateView();
                      } else {
                        btn.action();
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <span>{btn.icon}</span>
                    <span>{btn.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-4">
          <h3 className="font-bold mb-4">Design Tools</h3>
          <CardContent className="space-y-4">
            <Button onClick={handleAddText} className="w-full">
              Add Text
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              Upload Image
              <input
                id="imageUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUploadImage}
              />
            </Button>

            {selectedObject && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Selected Object Controls</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleObjectControls("delete")}
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleObjectControls("forward")}
                  >
                    Forward
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleObjectControls("backward")}
                  >
                    Backward
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleObjectControls("clone")}
                  >
                    Clone
                  </Button>
                </div>

                {selectedObject instanceof fabric.IText && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Font Size</label>
                      <Slider
                        value={[textControls.fontSize]}
                        onValueChange={([value]) =>
                          updateTextProperty("fontSize", value)
                        }
                        min={8}
                        max={80}
                        step={1}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Color</label>
                      <Input
                        type="color"
                        value={textControls.color}
                        onChange={(e) =>
                          updateTextProperty("fill", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {selectedObject instanceof fabric.Image && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Scale</label>
                      <Slider
                        value={[selectedObject.scaleX * 100]}
                        onValueChange={([value]) => {
                          selectedObject.scale(value / 100);
                          canvas?.renderAll();
                        }}
                        min={10}
                        max={200}
                        step={1}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="border rounded-lg overflow-hidden">
              <canvas id="canvas" ref={canvasRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <div>
          <h2 className="text-2xl font-bold">{product?.name}</h2>
          <p className="text-gray-600 mt-2">{product?.description}</p>
          <p className="text-2xl font-bold mt-4">
            ${product?.price?.toFixed(2)}
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Select Color</h3>
          <div className="flex gap-2">
            {product?.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "ring-2 ring-indigo-600 scale-110"
                    : "ring-1 ring-gray-200"
                }`}
                style={{
                  backgroundColor: color,
                  borderColor:
                    color.toLowerCase() === "white" ? "#e2e8f0" : color,
                }}
              >
                <span className="sr-only">{color}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Select Size</h3>
          <div className="flex flex-wrap gap-2">
            {product?.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-md transition-colors ${
                  selectedSize === size
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 hover:border-indigo-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <Button
          className="w-full mt-8"
          size="lg"
          onClick={handleAddToCart}
          disabled={!selectedColor || !selectedSize}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
