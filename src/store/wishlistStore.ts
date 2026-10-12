import { create } from 'zustand';
import { Product } from '@/types';
import { products } from '@/data/mockData';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  // Initialize with a couple items for realistic UX
  items: [products[0], products[1]],
  
  addItem: (product) => {
    if (!get().isInWishlist(product.id)) {
      set((state) => ({ items: [...state.items, product] }));
    }
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  toggleItem: (product) => {
    if (get().isInWishlist(product.id)) {
      get().removeItem(product.id);
    } else {
      get().addItem(product);
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  clearWishlist: () => set({ items: [] }),
}));
