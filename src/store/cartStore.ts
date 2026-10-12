import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (product: Product, size?: string, color?: { name: string; hex: string }, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    {
      id: 'item-1',
      productId: 'prod-1',
      name: 'عباية الحرير الملكي المطرزة بالذهب',
      slug: 'royal-black-silk-abaya',
      price: 1850,
      originalPrice: 2200,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      size: '56',
      color: { name: 'أسود ملكي', hex: '#111111' },
      quantity: 1,
    },
    {
      id: 'item-2',
      productId: 'prod-6',
      name: 'حقيبة كلاتش الهندسية المطلية بالذهب',
      slug: 'gold-plated-geometric-clutch',
      price: 890,
      image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=800&auto=format&fit=crop',
      size: 'مقاس موحد',
      color: { name: 'ذهب أصفر 18k', hex: '#D4942B' },
      quantity: 1,
    },
  ],
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  
  addItem: (product, size, color, quantity = 1) => {
    const selectedSize = size || product.sizes[0] || 'قياسي';
    const selectedColor = color || product.colors[0] || { name: 'افتراضي', hex: '#111111' };
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor.name}`;

    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { items: newItems, isDrawerOpen: true };
      }

      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity,
      };

      return { items: [...state.items, newItem], isDrawerOpen: true };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
}));
