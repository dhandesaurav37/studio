
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
  DialogTrigger,
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
  Loader2,
  Ruler,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { useStore, UserOrder } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { createRazorpayOrder } from "./actions";
import { adminOrders } from "@/lib/admin-data";
import { getAddressFromCoordinates } from "@/app/actions/geocoding";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


interface ProductDetailClientPageProps {
  product: Product;
  relatedProducts: Product[];
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const topCategories = ["T-Shirts", "Shirts", "Sweater", "Jackets", "Oversized T-shirts"];
const bottomCategories = ["Jeans", "Trousers", "Track Pants"];

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
    addNotification,
    addOrder,
    products: allProducts,
  } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
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
  
  const complementaryProducts = useMemo(() => {
    const isTop = topCategories.includes(product.category);
    const isBottom = bottomCategories.includes(product.category);

    if (isTop) {
      return allProducts.filter(p => bottomCategories.includes(p.category)).slice(0, 10);
    }
    if (isBottom) {
      return allProducts.filter(p => topCategories.includes(p.category)).slice(0, 10);
    }
    return [];
  }, [product.category, allProducts]);


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

      const newAdminOrderId = `WW-${Math.floor(Math.random() * 90000) + 10000}`;
      
      const newUserOrder: UserOrder = {
        id: newAdminOrderId,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}),
        deliveryDate: null,
        status: "Pending",
        total: product.price * quantity,
        items: [{ productId: product.id, quantity, size: selectedSize }]
      }
      
      const newAdminOrder = {
        id: newAdminOrderId,
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

      adminOrders.unshift(newAdminOrder);
      addOrder(newUserOrder);

      addNotification({
        id: Date.now(),
        type: 'admin',
        icon: 'Package',
        title: 'New COD Order Received',
        description: `Order #${newAdminOrderId} for ${product.name} has been placed by ${user.displayName || user.email}.`,
        time: 'Just now',
        read: false,
        orderId: newAdminOrderId,
      });

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
  
  const alphaSizes = useMemo(() => product.sizes.filter(s => isNaN(parseInt(s))), [product.sizes]);

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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Size</h3>
               <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    <Ruler className="mr-1.5 h-4 w-4" />
                    Size Guide
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-headline">Size Guide</DialogTitle>
                    <DialogDescription>
                      Find your perfect fit with our sizing chart. All measurements are in inches and centimeters.
                    </DialogDescription>
                  </DialogHeader>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">Size</TableHead>
                        <TableHead>Chest (inches)</TableHead>
                        <TableHead>Chest (cm)</TableHead>
                        <TableHead>Recommended for</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold">S</TableCell>
                        <TableCell>36 – 38 in</TableCell>
                        <TableCell>91 – 96 cm</TableCell>
                        <TableCell>Slim / lean build</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold">M</TableCell>
                        <TableCell>38 – 40 in</TableCell>
                        <TableCell>96 – 101 cm</TableCell>
                        <TableCell>Average build</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold">L</TableCell>
                        <TableCell>40 – 42 in</TableCell>
                        <TableCell>101 – 106 cm</TableCell>
                        <TableCell>Broad shoulders / athletic build</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold">XL</TableCell>
                        <TableCell>42 – 44 in</TableCell>
                        <TableCell>106 – 112 cm</TableCell>
                        <TableCell>Heavier / muscular build</TableCell>
                      </TableRow>
                       <TableRow>
                        <TableCell className="font-bold">XXL</TableCell>
                        <TableCell>44 – 46 in</TableCell>
                        <TableCell>112 – 117 cm</TableCell>
                        <TableCell>Larger build</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {alphaSizes.map((size) => (
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
      
      {/* Complete The Look */}
      {complementaryProducts.length > 0 && (
        <div className="mt-16 md:mt-20">
          <h2 className="text-2xl font-bold font-headline mb-6">
            Complete The Look
          </h2>
           <Carousel
              opts={{
                align: "start",
                loop: complementaryProducts.length > 5,
              }}
              className="w-full"
            >
              <CarouselContent>
                {complementaryProducts.map((p) => (
                  <CarouselItem
                    key={p.id}
                    className="sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                  >
                    <Link href={`/products/${p.id}`} className="block group">
                       <Card className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="relative aspect-[3/4] w-full">
                               <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                style={{ objectFit: "cover" }}
                                className="group-hover:scale-105 transition-transform duration-500"
                                data-ai-hint={p.dataAiHint}
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                              />
                            </div>
                          </CardContent>
                       </Card>
                       <h3 className="font-semibold text-sm truncate mt-2">{p.name}</h3>
                       <p className="text-sm text-muted-foreground">₹{p.price.toFixed(2)}</p>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
            </Carousel>
        </div>
      )}

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
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="new" id="new-address-radio" />
                    <Label
                      htmlFor="new-address-radio"
                      className="font-semibold cursor-pointer"
                    >
                      Ship to a New Address
                    </Label>
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
