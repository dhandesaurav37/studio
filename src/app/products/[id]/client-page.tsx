
"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Zap,
  Edit,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { createRazorpayOrder } from "./actions";
import { adminOrders } from "@/lib/admin-data";

interface ProductDetailClientPageProps {
  product: Product;
  relatedProducts: Product[];
}

declare global {
    interface Window {
      Razorpay: any;
    }
}

export default function ProductDetailClientPage({
  product,
  relatedProducts,
}: ProductDetailClientPageProps) {
  const {
    cart,
    addToCart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    profile,
  } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [addressOption, setAddressOption] = useState<"default" | "new">(
    "default"
  );
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [id]: value }));
  };

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    addToCart({ product, quantity, size: selectedSize });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed with your purchase.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }
    setIsPurchaseDialogOpen(true);
  };

  const handlePayment = async (method: "Online" | "COD") => {
    if (method === "COD") {
       if (!user || !selectedSize) return;

      const shippingAddress = addressOption === 'new' ? {
        name: newAddress.name,
        address: `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.pincode}`,
        phone: newAddress.mobile
      } : {
        name: profile.name,
        address: `${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.pincode}`,
        phone: profile.mobile
      };

      const newOrder = {
        id: `WW-${Math.floor(Math.random() * 90000) + 10000}`,
        date: new Date().toISOString().split('T')[0],
        customer: {
          name: user.displayName || 'N/A',
          email: user.email || 'N/A',
        },
        shippingAddress: shippingAddress,
        paymentMethod: "COD",
        status: "Pending" as const,
        total: product.price * quantity,
        items: [{ product, quantity, size: selectedSize }],
      };

      // In a real app, this would be an API call. Here we add to the mock data.
      adminOrders.unshift(newOrder);

      setIsPurchaseDialogOpen(false);
      toast({
        title: "Order Placed!",
        description: `Your order for ${product.name} will be processed shortly. Payment via COD.`,
      });
      router.push("/orders");
      return;
    }
    
    // Handle Online Payment
    try {
      const order = await createRazorpayOrder(product.price * quantity);
       const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "White Wolf",
        description: `Purchase of ${product.name}`,
        order_id: order.id,
        handler: function (response: any) {
            toast({
                title: "Payment Successful!",
                description: `Your payment for order ${response.razorpay_order_id} was successful.`,
            });
            setIsPurchaseDialogOpen(false);
            router.push("/orders");
        },
        prefill: {
            name: profile.name,
            email: profile.email,
            contact: profile.mobile,
        },
        notes: {
            address: `${profile.address.street}, ${profile.address.city}, ${profile.address.pincode}`,
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
  };

  const hasDefaultAddress =
    profile.address?.street &&
    profile.address?.city &&
    profile.address?.state &&
    profile.address?.pincode &&
    profile.mobile;

  const hasNewAddress =
    newAddress.name &&
    newAddress.street &&
    newAddress.city &&
    newAddress.state &&
    newAddress.pincode &&
    newAddress.mobile;

  const isAddressValid =
    (addressOption === "default" && hasDefaultAddress) ||
    (addressOption === "new" && hasNewAddress);

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <div className="grid grid-cols-1 gap-4">
          <div className="relative aspect-square w-full h-auto rounded-lg overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.dataAiHint}
              priority
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(1, 4).map((img, index) => (
              <div
                key={index}
                className="relative aspect-square w-full h-auto rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`${product.name} ${index + 2}`}
                  fill
                  className="object-cover"
                  data-ai-hint={product.dataAiHint}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              {product.rating.toFixed(1)} ({product.reviews} reviews)
            </span>
          </div>
          <p className="text-3xl font-bold mt-4">₹{product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mt-6 leading-relaxed">
            {product.description}
          </p>

          <Separator className="my-8" />

          {/* Size Selector */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                  className="w-16"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 flex-shrink-0"
              onClick={handleWishlistToggle}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isWishlisted && "fill-destructive text-destructive"
                )}
              />
              <span className="sr-only">Wishlist</span>
            </Button>
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Button
              size="lg"
              className="flex-1 w-full"
              variant="secondary"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button
              size="lg"
              className="flex-1 w-full"
              onClick={handleBuyNow}
              variant="destructive"
            >
              <Zap className="mr-2 h-5 w-5" /> Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16 md:mt-20">
        <h2 className="text-2xl font-bold font-headline mb-6">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      {/* Purchase Confirmation Dialog */}
      <Dialog
        open={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              Confirm Purchase
            </DialogTitle>
            <DialogDescription>
              Confirm your shipping details for "{product.name}".
            </DialogDescription>
          </DialogHeader>
          <RadioGroup
            value={addressOption}
            onValueChange={(value) =>
              setAddressOption(value as "default" | "new")
            }
            className="space-y-4"
          >
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="default" id="default-address" />
                  <Label
                    htmlFor="default-address"
                    className="font-semibold cursor-pointer"
                  >
                    Use Default Address
                  </Label>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">
                    <Edit className="mr-2 h-3 w-3" />
                    Change
                  </Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground mt-3 pl-8 space-y-1">
                {hasDefaultAddress ? (
                  <>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        {profile.address.street}, {profile.address.city},{" "}
                        {profile.address.state} - {profile.address.pincode}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-destructive">
                    No default address and/or phone number found. Please add
                    them in your profile.
                  </p>
                )}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="new" id="new-address" />
                <Label
                  htmlFor="new-address"
                  className="font-semibold cursor-pointer"
                >
                  Ship to a New Address
                </Label>
              </div>
              {addressOption === "new" && (
                <div className="space-y-3 mt-4 pl-8">
                  <Input
                    id="name"
                    placeholder="Full Name"
                    value={newAddress.name}
                    onChange={handleNewAddressChange}
                  />
                  <Input
                    id="mobile"
                    placeholder="Mobile Number"
                    value={newAddress.mobile}
                    onChange={handleNewAddressChange}
                  />
                  <Input
                    id="street"
                    placeholder="Street Address"
                    value={newAddress.street}
                    onChange={handleNewAddressChange}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      id="city"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                    />
                    <Input
                      id="state"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={handleNewAddressChange}
                    />
                    <Input
                      id="pincode"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={handleNewAddressChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
          <Separator />
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">
                ₹{(product.price * quantity).toFixed(2)}
              </p>
            </div>
            <div className="relative h-20 w-20 rounded-md overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={product.dataAiHint}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="destructive"
              onClick={() => handlePayment("Online")}
              disabled={!isAddressValid}
            >
              Pay Online
            </Button>
            <Button
              variant="secondary"
              onClick={() => handlePayment("COD")}
              disabled={!isAddressValid}
            >
              Cash on Delivery
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
