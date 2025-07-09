import { createContext, useState, useContext, useEffect } from "react";
import { fetchUser } from "@/services/authService";
import productApi from "@/api/productApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchCart = async (id) => {
    try {
      const response = await productApi.get(`/${id}/cart`);
      if (response.data) {
        setCartItems(response.data.items || []);
      }
    } catch (error) {
      throw error; // Re-throw to handle in loadUser
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Only load user and cart once on mount
  const loadUser = async () => {
    try {
      const userData = await fetchUser();
      setUser(userData);
      if (userData && userData._id) {
        await fetchCart(userData._id);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      if (error.message === "Unauthorized") {
        setUser(null);
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add cart methods
  const addToCart = (item) => {
    setCartItems((prev) => {
      // Check if item with same product, size, color exists
      const idx = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.color === item.color
      );
      if (idx > -1) {
        // Update quantity
        const updated = [...prev];
        updated[idx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  useEffect(() => {
    const getCartCount = () =>
      cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemsInCart(getCartCount());
  }, [cartItems]);

  const clearCart = () => setCartItems([]);

  const value = {
    user,
    setUser,
    loading,
    loadUser,
    cartItems,
    addToCart,
    clearCart,
    fetchCart,
    totalItemsInCart,
    setTotalItemsInCart,
    products,
    setProducts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
