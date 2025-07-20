
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/lib/data';

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

interface StoreState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  profile: UserProfile;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  setProfile: (profile: UserProfile) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const safelyParseJSON = (value: string | null, fallback: any = []) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [profile, setProfileState] = useState<UserProfile>(initialProfile);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCart(safelyParseJSON(localStorage.getItem('cart'), []));
    setWishlist(safelyParseJSON(localStorage.getItem('wishlist'), []));
    setProfileState(safelyParseJSON(localStorage.getItem('profile'), initialProfile));
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('profile', JSON.stringify(profile));
    }
  }, [profile, isMounted]);

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

  const value = {
    cart,
    wishlist,
    profile,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    setProfile,
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
