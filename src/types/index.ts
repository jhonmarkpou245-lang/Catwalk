export interface Product {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number | null;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  category_id?: string;
  category?: string | Category;
  categorySlug?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock?: number;
  inStock?: boolean;
  is_featured?: boolean;
  isFeatured?: boolean;
  is_new?: boolean;
  isNew?: boolean;
  is_on_sale?: boolean;
  isSale?: boolean;
  is_active?: boolean;
  subtitle?: string;
  details?: string[];
  rating?: number | { rate: number; count: number };
  reviewsCount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  image: string;
  description: string;
  parent_id?: string | null;
  sort_order?: number;
  is_active?: boolean;
  products_count?: number;
  productCount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  image: string;
  product?: Product;
  quantity: number;
  size: string;
  color: { name: string; hex: string };
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email?: string | null;
  customer_phone: string;
  shipping_address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'cod' | 'card';
  coupon_code?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  orders_count: number;
  total_spent: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  created_at: string;
}
