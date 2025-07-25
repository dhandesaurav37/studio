
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Product } from '@/lib/data';
import { rtdb, auth } from '@/lib/firebase';
import { ref, onValue, update, get } from 'firebase/database';
import type { Offer } from '@/app/admin/ads-and-offers/page';
import { onAuthStateChanged, User } from 'firebase/auth';

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
  emailNotifications: boolean;
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
    customer?: { 
        name: string;
        email: string;
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
  emailNotifications: true,
};

interface StoreState {
  products: Product[];
  productMap: Map<string, Product>;
  shopProducts: Product[];
  premiumProducts: Product[];
  activeOffers: Offer[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  profile: UserProfile;
  orders: UserOrder[];
  averageRating: number;
  totalRatings: number;
  user: User | null;
  getProductById: (id: string) => Product | undefined;
  getApplicableOffer: (product: Product) => Offer | undefined;
  calculateDiscountedPrice: (product: Product) => number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  setProfile: (profile: UserProfile) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, deliveryDate?: string) => Promise<void>;
  submitRating: (newRating: number) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const safelyParseJSON = (value: string | null, fallback: any) => {
  if (value === null || value === 'undefined') return fallback;
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null && typeof parsed.emailNotifications === 'undefined') {
        parsed.emailNotifications = true;
    }
    return parsed;
  } catch {
    return fallback;
  }
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [profile, setProfileState] = useState<UserProfile>(initialProfile);
  const [orders, setOrdersState] = useState<UserOrder[]>([]);
  const [averageRating, setAverageRating] = useState(4.7);
  const [totalRatings, setTotalRatings] = useState(256);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    const productsRef = ref(rtdb, 'products');
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
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
      console.error("Product DB error:", error);
    });

    const offersRef = ref(rtdb, 'offers');
    const unsubscribeOffers = onValue(offersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const offersData: Offer[] = Object.keys(data)
                .map(key => ({ id: key, ...data[key] }))
                .filter(offer => offer.isActive);
            setActiveOffers(offersData);
        } else {
            setActiveOffers([]);
        }
    }, (error) => {
        console.error("Offers DB error:", error);
    });

    setCart(safelyParseJSON(localStorage.getItem('cart'), []));
    setWishlist(safelyParseJSON(localStorage.getItem('wishlist'), []));
    setProfileState(safelyParseJSON(localStorage.getItem('profile'), initialProfile));
    setAverageRating(safelyParseJSON(localStorage.getItem('averageRating'), 4.7));
    setTotalRatings(safelyParseJSON(localStorage.getItem('totalRatings'), 256));


    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
      unsubscribeOffers();
    };
  }, []);

  useEffect(() => {
    if (!user) {
        setOrdersState([]); // Clear orders on logout
        return;
    };

    const ordersRef = ref(rtdb, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const allOrders: UserOrder[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
            const userOrders = allOrders.filter(order => order.customer?.email === user.email);
            setOrdersState(userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
            setOrdersState([]);
        }
    }, (error) => {
        console.error("Orders DB error:", error);
    });

    return () => unsubscribeOrders();
  }, [user]);

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
    if (isMounted) localStorage.setItem('averageRating', JSON.stringify(averageRating));
  }, [averageRating, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('totalRatings', JSON.stringify(totalRatings));
  }, [totalRatings, isMounted]);
  
  const getProductById = useCallback((id: string) => {
    return productMap.get(id);
  }, [productMap]);

  const getApplicableOffer = useCallback((product: Product): Offer | undefined => {
      for (const offer of activeOffers) {
          if (offer.appliesTo === 'products' && offer.targetIds.includes(product.id)) {
              return offer;
          }
          if (offer.appliesTo === 'categories' && offer.targetIds.includes(product.category)) {
              return offer;
          }
      }
      return undefined;
  }, [activeOffers]);

  const calculateDiscountedPrice = useCallback((product: Product): number => {
      const offer = getApplicableOffer(product);
      if (!offer) {
          return product.price;
      }
      if (offer.discountType === 'percentage') {
          return product.price * (1 - offer.discountValue / 100);
      }
      if (offer.discountType === 'fixed') {
          return Math.max(0, product.price - offer.discountValue);
      }
      return product.price;
  }, [getApplicableOffer]);

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
  
  const updateOrderStatus = async (orderId: string, status: OrderStatus, deliveryDate?: string) => {
    const orderRef = ref(rtdb, `orders/${orderId}`);
    const updates: { status: OrderStatus; deliveryDate?: string | null } = { status };

    if (status === 'Delivered') {
      updates.deliveryDate = new Date().toISOString();
    } else if (deliveryDate !== undefined) {
      updates.deliveryDate = deliveryDate;
    }

    await update(orderRef, updates);

    // After updating, fetch the latest order data to ensure email is sent with correct info
    const updatedOrderSnapshot = await get(orderRef);
    if (!updatedOrderSnapshot.exists()) {
        console.error("Order not found after update.");
        return;
    }
    const updatedOrderData = updatedOrderSnapshot.val();
    
    const customerEmail = updatedOrderData.customer?.email;
    const customerName = updatedOrderData.customer?.name || 'Valued Customer';
    
    if (profile.emailNotifications && customerEmail) {
        let templateName: string | null = null;
        let emailProps: any = { order: { ...updatedOrderData, id: orderId, customerName: customerName } };

        switch (status) {
            case 'Shipped': templateName = 'orderShipped'; break;
            case 'Delivered': templateName = 'orderDelivered'; break;
            case 'Cancelled': templateName = 'orderCancelled'; break;
            case 'Return Requested': templateName = 'returnRequested'; break;
            case 'Return Request Accepted':
            case 'Return Rejected':
            case 'Order Returned Successfully':
                templateName = 'returnStatus';
                emailProps.statusMessage = status;
                break;
        }

        if (templateName) {
            // Use fetch to call the API route
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: customerEmail,
                    templateName,
                    props: emailProps,
                })
            }).catch(error => console.error("Failed to trigger email:", error));
        }
    }
  };


  const submitRating = (newRating: number) => {
    const newTotalRatings = totalRatings + 1;
    const newAverageRating = (averageRating * totalRatings + newRating) / newTotalRatings;
    setTotalRatings(newTotalRatings);
    setAverageRating(newAverageRating);
  };

  const value = {
    products,
    productMap,
    shopProducts,
    premiumProducts,
    activeOffers,
    cart,
    wishlist,
    profile,
    orders,
    averageRating,
    totalRatings,
    user,
    getProductById,
    getApplicableOffer,
    calculateDiscountedPrice,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    setProfile,
    updateOrderStatus,
    submitRating,
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
