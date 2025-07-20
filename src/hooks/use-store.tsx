
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Product } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, DocumentData } from 'firebase/firestore';


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

interface StoreState {
  products: Product[];
  shopProducts: Product[];
  premiumProducts: Product[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  profile: UserProfile;
  notifications: Notification[];
  addProduct: (product: Product) => void;
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fetch products from Firestore
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData: Product[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
    });

    // Load other state from localStorage
    setCart(safelyParseJSON(localStorage.getItem('cart'), []));
    setWishlist(safelyParseJSON(localStorage.getItem('wishlist'), []));
    setProfileState(safelyParseJSON(localStorage.getItem('profile'), initialProfile));
    setNotifications(safelyParseJSON(localStorage.getItem('notifications'), initialNotifications));

    return () => unsubscribe();
  }, []);

  const shopProducts = useMemo(() => products.filter(p => p.price <= 4000), [products]);
  const premiumProducts = useMemo(() => products.filter(p => p.price > 4000), [products]);

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
  
  const addProduct = (product: Product) => {
    // This is now handled by Firestore, but we can keep it for optimistic UI updates if needed
    // Or just let Firestore's onSnapshot handle it. For simplicity, we'll let onSnapshot do the work.
  };
  
  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

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

  const value = {
    products,
    shopProducts,
    premiumProducts,
    cart,
    wishlist,
    profile,
    notifications,
    addProduct,
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
    markAllAsRead
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
