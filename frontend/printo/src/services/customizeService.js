/**
 * Resize an image file to the given width and height.
 * @param {File|Blob|string} imageInput - The image file, blob, or data URL.
 * @param {number} targetWidth
 * @param {number} targetHeight
 * @returns {Promise<string>} - Data URL of the resized image.
 */
export async function resizeImage(imageInput, targetWidth, targetHeight) {
  return new Promise((resolve, reject) => {
    let img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      try {
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    if (typeof imageInput === "string") {
      img.crossOrigin = "anonymous";
      img.src = imageInput;
      // Fix: If image is cached, onload may not fire
      if (img.complete) {
        setTimeout(() => img.onload());
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        if (img.complete) {
          setTimeout(() => img.onload());
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageInput);
    }
  });
}

/**
 * Get a resized image as a data URL, or fallback to the original if resizing fails.
 * @param {string|File|Blob} imageInput
 * @param {number} width
 * @param {number} height
 * @returns {Promise<string>}
 */
export async function getResizedImage(imageInput, width, height) {
  try {
    return await resizeImage(imageInput, width, height);
  } catch (err) {
    // fallback: just return the original imageInput if it's a string (URL or data URL)
    if (typeof imageInput === "string") return imageInput;
    // fallback: if File/Blob, convert to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageInput);
    });
  }
}

/**
 * Get the correct product image for the given view (front/back), templateImages, and product.
 * @param {object} params
 * @param {object} params.templateImages - Optional template images object with front/back keys
 * @param {object} params.product - Product object with images array
 * @param {string} params.productView - 'front' or 'back'
 * @returns {string} - Image URL
 */
export function getProductImage({ templateImages, product, productView }) {
  if (templateImages) {
    return productView === "front"
      ? templateImages.front
      : templateImages.back || templateImages.front;
  }
  if (product?.images) {
    return productView === "front"
      ? product.images[0]?.url
      : product.images[1]?.url || product.images[0]?.url;
  }
  return "/placeholder-product.png";
}
