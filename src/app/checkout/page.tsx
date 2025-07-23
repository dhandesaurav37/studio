
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStore, UserOrder } from "@/hooks/use-store";
import { Edit, Loader2, MapPin, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, rtdb } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createRazorpayOrder } from "../products/[id]/actions";
import { getAddressFromCoordinates } from "../actions/geocoding";
import { getShippingRates } from "../actions/shipping";
import { Skeleton } from "@/components/ui/skeleton";


declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ShippingOption {
    name: string;
    rate: number;
    estimated_delivery_days: string;
}

export default function CheckoutPage() {
  const { cart, profile, addNotification, clearCart, calculateDiscountedPrice } = useStore();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [addressOption, setAddressOption] = useState<"default" | "new">("default");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "", street: "", city: "", state: "", pincode: "", mobile: "",
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isFetchingRates, setIsFetchingRates] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (isClient && cart.length === 0) {
      router.replace('/products');
    }
  }, [cart, isClient, router]);
  
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = cart.reduce((acc, item) => acc + (item.product.price - calculateDiscountedPrice(item.product)) * item.quantity, 0);
  const discountedSubtotal = subtotal - discount;
  const total = discountedSubtotal + (selectedShipping?.rate || 0);

  const fetchRates = useCallback(async (pincode: string) => {
      if(pincode.length !== 6) {
          setShippingOptions([]);
          setSelectedShipping(null);
          return;
      };

      setIsFetchingRates(true);
      setSelectedShipping(null);
      
      const cartWeight = cart.reduce((acc, item) => acc + (item.product.name.includes("Jacket") ? 2 : 0.5) * item.quantity, 0);

      const result = await getShippingRates({
          delivery_postcode: pincode,
          weight: cartWeight > 0 ? cartWeight : 0.5,
          subtotal: discountedSubtotal
      });

      if (result.success && result.options) {
          setShippingOptions(result.options);
      } else {
          setShippingOptions([]);
          toast({
              title: "Shipping Not Available",
              description: result.message || "Could not find shipping options for this pincode.",
              variant: "destructive"
          });
      }
      setIsFetchingRates(false);
  }, [discountedSubtotal, cart, toast]);


  useEffect(() => {
    const deliveryPincode = addressOption === 'new' ? newAddress.pincode : profile.address.pincode;
    if (deliveryPincode) {
        fetchRates(deliveryPincode);
    }
  }, [addressOption, newAddress.pincode, profile.address.pincode, fetchRates]);


  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [id]: value }));
  };

  const handleFetchLocation = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const result = await getAddressFromCoordinates(latitude, longitude);

          if (result.success && result.address) {
             setNewAddress((prev) => ({
              ...prev,
              street: result.address!.street,
              city: result.address!.city,
              state: result.address!.state,
              pincode: result.address!.pincode
            }));
             toast({
              title: "Address updated",
              description: "Your address has been filled in.",
            });
          } else {
             toast({
              title: "Error fetching address",
              description: result.message || "Could not retrieve address details.",
              variant: "destructive",
            });
          }
          setIsFetchingLocation(false);
        },
        (error) => {
          toast({
            title: "Could not fetch location",
            description: "Please ensure location services are enabled.",
            variant: "destructive",
          });
          console.error("Geolocation error:", error);
          setIsFetchingLocation(false);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      setIsFetchingLocation(false);
    }
  };

  const hasDefaultAddress = profile.address?.street && profile.address?.city && profile.address?.state && profile.address?.pincode && profile.mobile;
  const hasNewAddress = newAddress.name && newAddress.street && newAddress.city && newAddress.state && newAddress.pincode && newAddress.mobile;
  const isAddressValid = (addressOption === "default" && hasDefaultAddress) || (addressOption === "new" && hasNewAddress);

  const handlePayment = async (method: "Online" | "COD") => {
    if (!isAddressValid || !user || !selectedShipping) {
      if(!selectedShipping) {
        toast({ title: "No shipping method", description: "Please select a shipping method.", variant: "destructive" });
      }
      return;
    }
    
    const shippingAddress = addressOption === 'new' ? {
        name: newAddress.name,
        address: `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.pincode}`,
        phone: newAddress.mobile
      } : {
        name: profile.name,
        address: `${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.pincode}`,
        phone: profile.mobile
      };

    const productNames = cart.map(item => item.product.name).join(', ');

    const placeOrder = async (orderId?: string) => {
        const ordersRef = ref(rtdb, 'orders');
        const newOrderRef = orderId ? ref(rtdb, `orders/${orderId}`) : push(ordersRef);
        const finalOrderId = newOrderRef.key!;

        const newAdminOrder = {
          id: finalOrderId,
          date: new Date().toISOString(),
          deliveryDate: null,
          customer: { name: user.displayName || 'N/A', email: user.email || 'N/A' },
          shippingAddress: shippingAddress,
          paymentMethod: method,
          status: "Pending" as const,
          total: total,
          items: cart.map(item => ({ 
              productId: item.product.id,
              quantity: item.quantity, 
              size: item.size 
          })),
        };
        
        try {
            await set(newOrderRef, newAdminOrder);
        
            addNotification({
                id: Date.now(),
                type: 'admin',
                icon: 'Package',
                title: `New ${method} Order Received`,
                description: `Order #${finalOrderId.slice(-6).toUpperCase()} for ${productNames} has been placed.`,
                time: 'Just now',
                read: false,
                orderId: finalOrderId,
            });

            clearCart();
            toast({
                title: "Order Placed!",
                description: `Your order will be processed shortly.`,
            });
            router.push("/orders");

        } catch (error) {
            console.error("Error placing order:", error);
            toast({ title: "Error", description: "Failed to save order. Please try again.", variant: "destructive" });
        }
    }

    if (method === "COD") {
       placeOrder();
    } else { // Online Payment
      const ordersRef = ref(rtdb, 'orders');
      const newOrderRef = push(ordersRef);
      const tempOrderId = newOrderRef.key!;
      try {
        const order = await createRazorpayOrder(total, tempOrderId);
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "White Wolf",
          description: `Order #${tempOrderId.slice(-6).toUpperCase()}`,
          order_id: order.id,
          handler: function (response: any) {
              placeOrder(order.receipt.replace('receipt_order_', ''));
          },
          prefill: {
              name: profile.name,
              email: user.email,
              contact: profile.mobile,
          },
          notes: {
              address: shippingAddress.address,
          },
          theme: {
              color: "#333333",
          },
        };
        
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
              toast({
                  title: "Payment Failed",
                  description: "Something went wrong. Please try again.",
                  variant: "destructive",
              });
        });
        rzp1.open();
      } catch(error) {
          toast({
              title: "Error",
              description: "Could not connect to payment gateway. Please try again later.",
              variant: "destructive",
          })
      }
    }
  };


  if (!isClient || !user) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        Checkout
      </h1>
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={addressOption} onValueChange={(value) => setAddressOption(value as "default" | "new")} className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="default" id="default-address" />
                      <Label htmlFor="default-address" className="font-semibold cursor-pointer">Use Default Address</Label>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/profile"><Edit className="mr-2 h-3 w-3" />Change</Link>
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground mt-3 pl-8 space-y-1">
                    {hasDefaultAddress ? (
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{profile.address.street}, {profile.address.city}, {profile.address.state} - {profile.address.pincode}</span>
                      </div>
                    ) : (
                      <p className="text-destructive">No default address. Please add one in your profile or use a new address.</p>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="new" id="new-address-radio" />
                      <Label htmlFor="new-address-radio" className="font-semibold cursor-pointer">Ship to a New Address</Label>
                    </div>
                    {addressOption === "new" && (
                       <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleFetchLocation} disabled={isFetchingLocation}>
                         {isFetchingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <MapPin className="mr-1 h-4 w-4" />} 
                         {isFetchingLocation ? 'Fetching...' : 'Use my current location'}
                       </Button>
                    )}
                  </div>
                  {addressOption === "new" && (
                    <div className="space-y-3 mt-4 pl-8">
                      <Input id="name" placeholder="Full Name" value={newAddress.name} onChange={handleNewAddressChange} />
                      <Input id="mobile" placeholder="Mobile Number" value={newAddress.mobile} onChange={handleNewAddressChange} />
                      <Input id="street" placeholder="Street Address" value={newAddress.street} onChange={handleNewAddressChange} />
                      <div className="grid grid-cols-3 gap-2">
                        <Input id="city" placeholder="City" value={newAddress.city} onChange={handleNewAddressChange} />
                        <Input id="state" placeholder="State" value={newAddress.state} onChange={handleNewAddressChange} />
                        <Input id="pincode" placeholder="Pincode" value={newAddress.pincode} onChange={handleNewAddressChange} />
                      </div>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
            </CardHeader>
            <CardContent>
                {isFetchingRates ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : shippingOptions.length > 0 ? (
                    <RadioGroup value={selectedShipping?.name} onValueChange={(name) => setSelectedShipping(shippingOptions.find(opt => opt.name === name) || null)}>
                        {shippingOptions.map(option => (
                             <Label key={option.name} htmlFor={option.name} className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value={option.name} id={option.name} />
                                    <div>
                                        <p className="font-semibold">{option.name}</p>
                                        <p className="text-sm text-muted-foreground">Est. Delivery: {option.estimated_delivery_days}</p>
                                    </div>
                                </div>
                                <p className="font-bold">₹{option.rate.toFixed(2)}</p>
                            </Label>
                        ))}
                    </RadioGroup>
                ) : (
                    <div className="text-center text-muted-foreground p-4 border border-dashed rounded-lg">
                        <Truck className="mx-auto h-8 w-8 mb-2" />
                        <p>Enter a valid pincode to see shipping options.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6 md:sticky md:top-24">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-center text-sm">
                   <div className="flex items-center gap-2">
                     <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" data-ai-hint={item.product.dataAiHint} />
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                   </div>
                   <p>₹{(calculateDiscountedPrice(item.product) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Discount</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{selectedShipping ? `₹${selectedShipping.rate.toFixed(2)}` : '---'}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="destructive" onClick={() => handlePayment("Online")} disabled={!isAddressValid || !selectedShipping}>Pay Online</Button>
                <Button variant="secondary" onClick={() => handlePayment("COD")} disabled={!isAddressValid || !selectedShipping}>Cash on Delivery</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
