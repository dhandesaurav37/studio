
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStore, UserOrder } from "@/hooks/use-store";
import { Edit, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createRazorpayOrder } from "../products/[id]/actions";
import { adminOrders } from "@/lib/admin-data";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, profile, addOrder, addNotification, clearCart } = useStore();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [addressOption, setAddressOption] = useState<"default" | "new">("default");
  const [newAddress, setNewAddress] = useState({
    name: "", street: "", city: "", state: "", pincode: "", mobile: "",
  });

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

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [id]: value }));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const hasDefaultAddress = profile.address?.street && profile.address?.city && profile.address?.state && profile.address?.pincode && profile.mobile;
  const hasNewAddress = newAddress.name && newAddress.street && newAddress.city && newAddress.state && newAddress.pincode && newAddress.mobile;
  const isAddressValid = (addressOption === "default" && hasDefaultAddress) || (addressOption === "new" && hasNewAddress);

  const handlePayment = async (method: "Online" | "COD") => {
    if (!isAddressValid || !user) return;
    
    const shippingAddress = addressOption === 'new' ? {
        name: newAddress.name,
        address: `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.pincode}`,
        phone: newAddress.mobile
      } : {
        name: profile.name,
        address: `${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.pincode}`,
        phone: profile.mobile
      };

    const newAdminOrderId = `WW-${Math.floor(Math.random() * 90000) + 10000}`;
    const productNames = cart.map(item => item.product.name).join(', ');

    const placeOrder = () => {
        const newUserOrder: UserOrder = {
          id: newAdminOrderId,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}),
          deliveryDate: null,
          status: "Pending",
          total: total,
          items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity, size: item.size }))
        };

        const newAdminOrder = {
          id: newAdminOrderId,
          date: new Date().toISOString().split('T')[0],
          customer: { name: user.displayName || 'N/A', email: user.email || 'N/A' },
          shippingAddress: shippingAddress,
          paymentMethod: method,
          status: "Pending" as const,
          total: total,
          items: cart.map(item => ({ product: item.product, quantity: item.quantity, size: item.size })),
        };
        
        adminOrders.unshift(newAdminOrder);
        addOrder(newUserOrder);

        addNotification({
            id: Date.now(),
            type: 'admin',
            icon: 'Package',
            title: `New ${method} Order Received`,
            description: `Order #${newAdminOrderId} for ${productNames} has been placed.`,
            time: 'Just now',
            read: false,
            orderId: newAdminOrderId,
        });

        clearCart();
        toast({
            title: "Order Placed!",
            description: `Your order will be processed shortly.`,
        });
        router.push("/orders");
    }

    if (method === "COD") {
       placeOrder();
    } else { // Online Payment
      try {
        const order = await createRazorpayOrder(total);
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "White Wolf",
          description: `Order #${newAdminOrderId}`,
          order_id: order.id,
          handler: function (response: any) {
              placeOrder();
          },
          prefill: {
              name: profile.name,
              email: profile.email,
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
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="new" id="new-address" />
                    <Label htmlFor="new-address" className="font-semibold cursor-pointer">Ship to a New Address</Label>
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
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="destructive" onClick={() => handlePayment("Online")} disabled={!isAddressValid}>Pay Online</Button>
                <Button variant="secondary" onClick={() => handlePayment("COD")} disabled={!isAddressValid}>Cash on Delivery</Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
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
                   <p>₹{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
