import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, color, customization = null) => {
        const items = get().items;
        const itemKey = `${product._id}-${size}-${color}${
          customization ? "-custom" : ""
        }`;

        // For customized products, always add as new item
        if (customization) {
          set({
            items: [
              ...items,
              {
                id: product._id,
                name: product.name,
                price: product.price,
                image: customization.preview || product.images[0]?.url,
                size,
                color,
                quantity: 1,
                customization,
              },
            ],
          });
          return;
        }

        const existingItem = items.find(
          (item) =>
            item.id === product._id &&
            item.size === size &&
            item.color === color &&
            JSON.stringify(item.customization) === JSON.stringify(customization)
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product._id &&
              item.size === size &&
              item.color === color &&
              JSON.stringify(item.customization) ===
                JSON.stringify(customization)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product._id,
                name: product.name,
                price: product.price,
                image: customization?.preview || product.images[0]?.url,
                size,
                color,
                quantity: 1,
                customization,
              },
            ],
          });
        }
      },
      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.id === id && item.size === size && item.color === color)
          ),
        }));
      },
      updateQuantity: (id, size, color, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
