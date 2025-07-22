
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Product } from '@/lib/data';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';


export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export type WishlistItem = Product;

export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface Notification {
  id: number;
  type: 'user' | 'admin';
  icon: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  orderId?: string;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    size: string;
    product?: Product;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Return Requested' | 'Return Request Accepted' | 'Order Returned Successfully' | 'Return Rejected';

export interface UserOrder {
    id: string;
    date: string;
    deliveryDate: string | null;
    status: OrderStatus;
    total: number;
    items: OrderItem[];
}

const initialProfile: UserProfile = {
  name: "",
  email: "",
  mobile: "",
  address: {
    street: "",
    city: "",
    state: "",
    pincode: "",
  },
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'user',
    icon: 'Tag',
    title: "Summer Sale is LIVE!",
    description: "Get up to 50% off on selected items. Don't miss out!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: 'user',
    icon: 'Truck',
    title: "Your order #WW-84521 has been delivered.",
    description: "We hope you enjoy your new gear!",
    time: "1 day ago",
    read: true,
  },
  {
    id: 3,
    type: 'user',
    icon: 'Bell',
    title: "New Arrivals: The Linen Collection",
    description: "Stay cool this summer with our new breathable linen shirts.",
    time: "3 days ago",
    read: true,
  },
];

const initialOrders: UserOrder[] = [
  {
    id: "WW-84521",
    date: "June 15, 2024",
    deliveryDate: "2024-06-20T12:00:00.000Z",
    status: "Delivered",
    total: 18498,
    items: [
      { productId: "3", quantity: 1, size: "L" },
      { productId: "2", quantity: 1, size: "M" },
    ],
  },
  {
    id: "WW-84199",
    date: "May 28, 2024",
    deliveryDate: "2024-06-02T12:00:00.000Z",
    status: "Delivered",
    total: 5499,
    items: [{ productId: "2", quantity: 1, size: "L" }],
  },
  {
    id: "WW-83712",
    date: "April 5, 2024",
    deliveryDate: null,
    status: "Cancelled",
    total: 12999,
    items: [{ productId: "3", quantity: 1, size: "XL" }],
  },
];

interface StoreState {
  products: Product[];
  productMap: Map<string, Product>;
  shopProducts: Product[];
  premiumProducts: Product[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  profile: UserProfile;
  notifications: Notification[];
  orders: UserOrder[];
  getProductById: (id: string) => Product | undefined;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  setProfile: (profile: UserProfile) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: (type: 'user' | 'admin') => void;
  addOrder: (order: UserOrder) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, deliveryDate?: string) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const safelyParseJSON = (value: string | null, fallback: any) => {
  if (value === null || value === 'undefined') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [profile, setProfileState] = useState<UserProfile>(initialProfile);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [orders, setOrdersState] = useState<UserOrder[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fetch products from Realtime Database
    const productsRef = ref(rtdb, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsData: Product[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    }, (error) => {
      console.error("Realtime Database snapshot error:", error);
    });

    // Load other state from localStorage
    setCart(safelyParseJSON(localStorage.getItem('cart'), []));
    setWishlist(safelyParseJSON(localStorage.getItem('wishlist'), []));
    setProfileState(safelyParseJSON(localStorage.getItem('profile'), initialProfile));
    setNotifications(safelyParseJSON(localStorage.getItem('notifications'), initialNotifications));
    setOrdersState(safelyParseJSON(localStorage.getItem('orders'), initialOrders));

    return () => unsubscribe();
  }, []);

  const shopProducts = useMemo(() => products.filter(p => p.price <= 4000), [products]);
  const premiumProducts = useMemo(() => products.filter(p => p.price > 4000), [products]);
  const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);


  useEffect(() => {
    if (isMounted) localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications, isMounted]);

   useEffect(() => {
    if (isMounted) localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders, isMounted]);
  
  const getProductById = useCallback((id: string) => {
    return productMap.get(id);
  }, [productMap]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === newItem.product.id && item.size === newItem.size
      );
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }
      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (newItem: WishlistItem) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.some((item) => item.id === newItem.id)) {
        return [...prevWishlist, newItem];
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== productId));
  };
  
  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
  }

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = (type: 'user' | 'admin') => {
    setNotifications(prev =>
      prev.map(n => (n.type === type ? { ...n, read: true } : n))
    );
  }
  
  const addOrder = (order: UserOrder) => {
    setOrdersState(prevOrders => [order, ...prevOrders]);
  };
  
  const updateOrderStatus = (orderId: string, status: OrderStatus, deliveryDate?: string) => {
    setOrdersState(prevOrders =>
      prevOrders.map(o => (o.id === orderId ? { ...o, status, deliveryDate: deliveryDate !== undefined ? deliveryDate : o.deliveryDate } : o))
    );
  };

  const value = {
    products,
    productMap,
    shopProducts,
    premiumProducts,
    cart,
    wishlist,
    profile,
    notifications,
    orders,
    getProductById,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    setProfile,
    addNotification,
    markAsRead,
    markAllAsRead,
    addOrder,
    updateOrderStatus,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
