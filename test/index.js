window.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector("img");
  if (!img) return;

  // Wrap image in a relative container
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";
  wrapper.style.margin = "auto";
  wrapper.style.left = "50%";
  wrapper.style.transform = "translateX(-50%)";

  img.parentNode.insertBefore(wrapper, img);
  wrapper.appendChild(img);

  // Add overlay for color tint
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.pointerEvents = "none";
  overlay.style.opacity = "0.5";
  overlay.style.mixBlendMode = "multiply";
  overlay.style.display = "none";
  // Mask the overlay to the non-transparent part of the image
  overlay.style.webkitMaskImage = `url(${img.src})`;
  overlay.style.maskImage = `url(${img.src})`;
  overlay.style.webkitMaskRepeat = "no-repeat";
  overlay.style.maskRepeat = "no-repeat";
  overlay.style.webkitMaskSize = "100% 100%";
  overlay.style.maskSize = "100% 100%";
  wrapper.appendChild(overlay);

  // Initial size
  img.style.width = img.width + "px";
  img.style.height = img.height + "px";
  img.style.maxWidth = "100%";
  img.style.display = "block";

  // Add border on hover or resizing
  function showBorder() {
    img.style.boxSizing = "border-box";
    img.style.border = "2px dashed #0078d7";
  }
  function hideBorder() {
    if (!resizing) img.style.border = "none";
  }

  // Resizer settings
  const borderSize = 8;

  // Resizing logic
  let resizing = false,
    resizeDir = "",
    startX,
    startY,
    startWidth,
    startHeight,
    startLeft,
    startTop;

  // Undo stack for resize history
  const resizeHistory = [];

  // Save current state to history
  function saveResizeState() {
    resizeHistory.push({
      width: img.style.width,
      height: img.style.height,
      left: img.style.left,
      top: img.style.top,
    });
    // Limit history size if desired
    if (resizeHistory.length > 50) resizeHistory.shift();
  }

  // Restore previous state
  function undoResize() {
    if (resizeHistory.length === 0) return;
    const prev = resizeHistory.pop();
    img.style.width = prev.width;
    img.style.height = prev.height;
    img.style.left = prev.left;
    img.style.top = prev.top;
  }

  // Mouse position to edge/corner detection
  function getResizeDir(e) {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let dir = "";
    if (x <= borderSize && y <= borderSize) dir = "nw";
    else if (x >= rect.width - borderSize && y <= borderSize) dir = "ne";
    else if (x >= rect.width - borderSize && y >= rect.height - borderSize)
      dir = "se";
    else if (x <= borderSize && y >= rect.height - borderSize) dir = "sw";
    else if (y <= borderSize) dir = "n";
    else if (x >= rect.width - borderSize) dir = "e";
    else if (y >= rect.height - borderSize) dir = "s";
    else if (x <= borderSize) dir = "w";
    return dir;
  }

  wrapper.addEventListener("mousemove", (e) => {
    if (resizing) return;
    showBorder();
    const dir = getResizeDir(e);
    let cursor = "";
    switch (dir) {
      case "nw":
        cursor = "nwse-resize";
        break;
      case "ne":
        cursor = "nesw-resize";
        break;
      case "se":
        cursor = "nwse-resize";
        break;
      case "sw":
        cursor = "nesw-resize";
        break;
      case "n":
      case "s":
        cursor = "ns-resize";
        break;
      case "e":
      case "w":
        cursor = "ew-resize";
        break;
      default:
        cursor = "";
    }
    wrapper.style.cursor = cursor;
  });

  wrapper.addEventListener("mouseleave", () => {
    if (!resizing) {
      wrapper.style.cursor = "";
      hideBorder();
    }
  });

  wrapper.addEventListener("mousedown", (e) => {
    const dir = getResizeDir(e);
    if (!dir) return;
    e.preventDefault();
    resizing = true;
    resizeDir = dir;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = img.offsetWidth;
    startHeight = img.offsetHeight;
    startLeft = img.offsetLeft;
    startTop = img.offsetTop;
    document.body.style.userSelect = "none";
    showBorder();
    saveResizeState(); // Save state before resizing
  });

  document.addEventListener("mousemove", (e) => {
    if (!resizing) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    let newWidth = startWidth,
      newHeight = startHeight;

    // Corner handles: only allow diagonal resize (proportional, no side-only resize)
    if (
      resizeDir === "nw" ||
      resizeDir === "ne" ||
      resizeDir === "se" ||
      resizeDir === "sw"
    ) {
      let delta;
      if (resizeDir === "nw") {
        delta = Math.min(-dx, -dy);
        newWidth = Math.max(50, startWidth - delta);
        newHeight = Math.max(50, startHeight - delta);
        img.style.left = startLeft + (startWidth - newWidth) + "px";
        img.style.top = startTop + (startHeight - newHeight) + "px";
      } else if (resizeDir === "ne") {
        delta = Math.min(dx, -dy);
        newWidth = Math.max(50, startWidth + delta);
        newHeight = Math.max(50, startHeight - delta);
        img.style.top = startTop + (startHeight - newHeight) + "px";
      } else if (resizeDir === "se") {
        delta = Math.max(dx, dy);
        newWidth = Math.max(50, startWidth + delta);
        newHeight = Math.max(50, startHeight + delta);
      } else if (resizeDir === "sw") {
        delta = Math.max(-dx, dy);
        newWidth = Math.max(50, startWidth - delta);
        newHeight = Math.max(50, startHeight + delta);
        img.style.left = startLeft + (startWidth - newWidth) + "px";
      }
    }
    // Side handles: only allow resizing in one direction
    else if (resizeDir === "n" || resizeDir === "s") {
      newHeight =
        resizeDir === "n"
          ? Math.max(50, startHeight - dy)
          : Math.max(50, startHeight + dy);
      if (resizeDir === "n")
        img.style.top = startTop + (startHeight - newHeight) + "px";
    } else if (resizeDir === "e" || resizeDir === "w") {
      newWidth =
        resizeDir === "w"
          ? Math.max(50, startWidth - dx)
          : Math.max(50, startWidth + dx);
      if (resizeDir === "w")
        img.style.left = startLeft + (startWidth - newWidth) + "px";
    }

    img.style.width = newWidth + "px";
    img.style.height = newHeight + "px";
    // Keep overlay in sync
    overlay.style.width = img.style.width;
    overlay.style.height = img.style.height;
    // Keep mask size in sync
    overlay.style.webkitMaskSize = img.style.width + " " + img.style.height;
    overlay.style.maskSize = img.style.width + " " + img.style.height;
  });

  document.addEventListener("mouseup", () => {
    resizing = false;
    document.body.style.userSelect = "";
    hideBorder();
  });

  document.addEventListener("keydown", (e) => {
    // Ctrl+Z or Cmd+Z
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undoResize();
    }
  });

  // Color palette logic
  const colorCircles = document.querySelectorAll(".color-circle");
  colorCircles.forEach((circle) => {
    circle.addEventListener("click", () => {
      // Remove highlight from all
      colorCircles.forEach((c) => (c.style.borderColor = "#ccc"));
      // Highlight selected
      circle.style.borderColor = "#333";
      // Get color
      const color = circle.getAttribute("data-color");
      // Apply color overlay using overlay div
      overlay.style.background = color;
      overlay.style.display = "block";
    });
  });

  // Screenshot logic
  // Add screenshot button logic
  const btn = document.getElementById("bottom-btn");
  if (btn) {
    btn.addEventListener("click", async () => {
      const container = document.querySelector(".image-container");
      const resultDiv = document.getElementById("screenshot-result");
      if (!container || !resultDiv) return;

      // Load html2canvas if not already loaded
      if (typeof html2canvas === "undefined") {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
        script.onload = takeScreenshot;
        document.body.appendChild(script);
      } else {
        takeScreenshot();
      }

      function takeScreenshot() {
        html2canvas(container).then((canvas) => {
          resultDiv.innerHTML = ""; // Clear previous
          resultDiv.appendChild(canvas);
        });
      }
    });
  }
});
