import axios from "./axios";

export const createProduct = async (productData) => {
  try {
    console.log("[Product Service] Creating product with data:", productData);
    const { data } = await axios.post("/products", productData);
    console.log("[Product Service] Product created successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "[Product Service] Create product error:",
      error.response?.data
    );
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};

export const addToCart = async (productId, size, color, quantity = 1) => {
  try {
    const { data } = await axios.post(`/products/${productId}/cart`, {
      productId,
      size,
      color,
      quantity,
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add to cart");
  }
};
