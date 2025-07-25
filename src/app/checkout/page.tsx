
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/hooks/use-store";
import { Edit, Loader2, MapPin } from "lucide-react";
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, profile, clearCart, calculateDiscountedPrice } = useStore();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [addressOption, setAddressOption] = useState<"default" | "new">("default");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "", street: "", city: "", state: "", pincode: "", mobile: "",
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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
  const shippingCost = cart.length > 0 ? 100 : 0;
  const total = discountedSubtotal + shippingCost;

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

  const placeOrder = async (orderId: string, method: "Online" | "COD") => {
      const shippingAddress = addressOption === 'new' ? {
          name: newAddress.name,
          address: `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.pincode}`,
          phone: newAddress.mobile
        } : {
          name: profile.name,
          address: `${profile.address.street}, ${profile.address.city}, ${profile.address.state}, ${profile.address.pincode}`,
          phone: profile.mobile
        };
      
      const newAdminOrder = {
        id: orderId,
        date: new Date().toISOString(),
        deliveryDate: null,
        customer: { name: user!.displayName || 'N/A', email: user!.email || 'N/A' },
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
          await set(ref(rtdb, `orders/${orderId}`), newAdminOrder);
          
          if (profile.emailNotifications && user!.email) {
              fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: user!.email,
                    templateName: 'orderConfirmation',
                    props: {
                        order: { ...newAdminOrder, customerName: profile.name }
                    },
                })
              });
          }

          clearCart();
          toast({
              title: "Order Placed!",
              description: `Your order will be processed shortly.`,
          });
          router.push("/orders");

      } catch (error) {
          console.error("Error placing order:", error);
          toast({ title: "Error", description: "Failed to save order. Please try again.", variant: "destructive" });
      } finally {
        setIsPlacingOrder(false);
      }
  }

  const handlePayment = async (method: "Online" | "COD") => {
    if (!isAddressValid || !user) {
      toast({ title: "Invalid Address", description: "Please provide a valid shipping address.", variant: "destructive" });
      return;
    }

    setIsPlacingOrder(true);
    
    const newOrderRef = push(ref(rtdb, 'orders'));
    const orderId = newOrderRef.key!;

    if (method === "COD") {
       placeOrder(orderId, method);
    } else { // Online Payment
      try {
        const order = await createRazorpayOrder(total, orderId);
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
          throw new Error("Razorpay Key ID is not configured.");
        }
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "White Wolf",
          description: `Order #${orderId.slice(-6).toUpperCase()}`,
          order_id: order.id,
          handler: function (response: any) {
              placeOrder(order.receipt.replace('receipt_order_', ''), 'Online');
          },
          prefill: {
              name: profile.name,
              email: user.email,
              contact: profile.mobile,
          },
          notes: {
              address: (addressOption === 'new' ? `${newAddress.street}, ${newAddress.city}` : `${profile.address.street}, ${profile.address.city}`),
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
              setIsPlacingOrder(false);
        });
        rzp1.open();
      } catch(error) {
          toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Could not connect to payment gateway. Please try again later.",
              variant: "destructive",
          })
          setIsPlacingOrder(false);
      }
    }
  };


  if (!isClient || !user) {
    return (
      <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
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
                <span>₹{shippingCost.toFixed(2)}</span>
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
                <Button variant="destructive" onClick={() => handlePayment("Online")} disabled={!isAddressValid || isPlacingOrder}>
                    {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Pay Online
                </Button>
                <Button variant="secondary" onClick={() => handlePayment("COD")} disabled={!isAddressValid || isPlacingOrder}>
                    {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Cash on Delivery
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
