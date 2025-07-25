
"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useState, useEffect, useMemo, useCallback } from "react";
import { ProductCard } from "@/components/product-card";
import { useStore, UserOrder } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { auth, rtdb } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { createRazorpayOrder } from "./actions";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";


interface ProductDetailClientPageProps {
  product: Product;
  similarProducts: Product[];
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
  product: initialProduct,
  similarProducts,
  relatedProducts,
}: ProductDetailClientPageProps) {
  const {
    getProductById,
    cart,
    wishlist,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    profile,
    products: allProducts,
    calculateDiscountedPrice,
    getApplicableOffer,
  } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [product, setProduct] = useState(initialProduct);
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

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  useEffect(() => {
    if (initialProduct.name === "Loading..." && allProducts.length > 0) {
      const realProduct = getProductById(initialProduct.id);
      if (realProduct) {
        setProduct(realProduct);
      }
    } else {
        setProduct(initialProduct);
    }
  }, [initialProduct, getProductById, allProducts]);


  const discountedPrice = calculateDiscountedPrice(product);
  const hasOffer = getApplicableOffer(product);
  const subtotal = discountedPrice * quantity;
  const shippingCost = 100;
  const total = subtotal + shippingCost;
  
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

  const allCategories = [...new Set(allProducts.map((p) => p.category))];

   const categoryImages = useMemo(() => {
    const images: { [key: string]: { src: string; hint: string } } = {};
    allCategories.forEach((category) => {
      const productForCategory = allProducts.find((p) => p.category === category);
      if (productForCategory && productForCategory.images.length > 0) {
        images[category] = {
          src: productForCategory.images[0],
          hint: productForCategory.dataAiHint,
        };
      } else {
        images[category] = {
          src: "https://placehold.co/600x400.png",
          hint: category.toLowerCase(),
        };
      }
    });
    return images;
  }, [allCategories, allProducts]);


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

  const placeOrder = async (method: "Online" | "COD", orderId?: string) => {
      if (!user || !selectedSize) return;

      const shippingAddress = addressOption === 'new' ? {
        name: newAddress.name,
        address: `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.pincode}`,
        phone: newAddress.mobile
      } : {
        name: profile.name,
        address: `${profile.address.street}, ${profile.address.city}, ${profile.address.state}, ${profile.address.pincode}`,
        phone: profile.mobile
      };

      const ordersRef = ref(rtdb, 'orders');
      const newOrderRef = orderId ? ref(rtdb, `orders/${orderId}`) : push(ordersRef);
      const finalOrderId = newOrderRef.key!;
      
      const newAdminOrder = {
        id: finalOrderId,
        date: new Date().toISOString(),
        deliveryDate: null,
        customer: {
          name: user.displayName || 'N/A',
          email: user.email || 'N/A',
        },
        shippingAddress: shippingAddress,
        paymentMethod: method,
        status: "Pending" as const,
        total: total,
        items: [{ 
            productId: product.id,
            quantity: quantity, 
            size: selectedSize 
        }],
      };
      
      try {
        await set(newOrderRef, newAdminOrder);
        
        if (profile.emailNotifications && user.email) {
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: user.email,
                    templateName: 'orderConfirmation',
                    props: {
                        order: { ...newAdminOrder, customerName: profile.name }
                    },
                })
            });
        }

        setIsPurchaseDialogOpen(false);
        toast({
            title: "Order Placed!",
            description: `Your order for ${product.name} will be processed shortly.`,
        });
        router.push("/orders");
      } catch (error) {
        console.error("Error placing order:", error);
        toast({ title: "Error", description: "Failed to save order. Please try again.", variant: "destructive" });
      } finally {
        setIsPlacingOrder(false);
      }
  };

  const handlePayment = async (method: "Online" | "COD") => {
    if (!isAddressValid) {
        toast({ title: "Invalid Address", description: "Please provide a valid shipping address.", variant: "destructive" });
        return;
    }
    
    setIsPlacingOrder(true);

    if (method === "COD") {
       placeOrder(method);
    } else { // Handle Online Payment
      const newOrderRef = push(ref(rtdb, 'orders'));
      const tempOrderId = newOrderRef.key!;
      try {
        const order = await createRazorpayOrder(total, tempOrderId);
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
          throw new Error("Razorpay Key ID is not configured.");
        }
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "White Wolf",
            description: `Purchase of ${product.name}`,
            order_id: order.id,
            handler: function (response: any) {
                placeOrder(method, order.receipt.replace('receipt_order_', ''));
            },
            prefill: {
                name: profile.name,
                email: user?.email,
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

  const ProductCarousel = ({ products }: { products: Product[] }) => (
    <Carousel
      opts={{
        align: "start",
        loop: products.length > 4,
      }}
      className="w-full"
    >
      <CarouselContent>
        {products.map((p) => (
          <CarouselItem key={p.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
            <div className="p-1 h-full">
              <ProductCard product={p} className="h-full" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
    </Carousel>
  );
  
  if (product.name === "Loading...") {
    return (
        <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
                 <div className="md:col-span-2">
                    <Skeleton className="aspect-[4/5] w-full rounded-lg" />
                 </div>
                 <div className="md:col-span-3 pt-0 md:pt-8 space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-6 w-1/5" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-16" />
                        <Skeleton className="h-10 w-16" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                 </div>
            </div>
        </div>
    )
  }

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="md:col-span-2">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[4/5] w-full h-auto rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint={product.dataAiHint}
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-foreground bg-background/50 hover:bg-background/80" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-foreground bg-background/50 hover:bg-background/80" />
            </Carousel>
        </div>


        {/* Product Details */}
        <div className="md:col-span-3 pt-0 md:pt-8">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-4 mt-4">
            <p className="text-3xl font-bold">₹{discountedPrice.toFixed(2)}</p>
            {hasOffer && (
                <>
                    <p className="text-xl font-medium text-muted-foreground line-through">₹{product.price.toFixed(2)}</p>
                    {hasOffer.discountType === 'percentage' && (
                         <Badge variant="destructive" className="text-base">
                            {hasOffer.discountValue}% OFF
                         </Badge>
                    )}
                </>
            )}
          </div>
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
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              size="lg"
              className="flex-1"
              variant="secondary"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button
              size="lg"
              className="flex-1"
              onClick={handleBuyNow}
              variant="destructive"
            >
              <Zap className="mr-2 h-5 w-5" /> Buy Now
            </Button>
          </div>
        </div>
      </div>
      
       {/* Similar Products */}
       {similarProducts.length > 0 && (
        <div className="mt-16 md:mt-20">
          <h2 className="text-2xl font-bold font-headline mb-6">
            Similar Products
          </h2>
          <ProductCarousel products={similarProducts} />
        </div>
      )}


      {/* Related Products */}
      <div className="mt-16 md:mt-20">
        <h2 className="text-2xl font-bold font-headline mb-6">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
      
      {/* Shop by Category Section */}
      <section className="py-16 md:py-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Explore our diverse range of apparel and accessories.
            </p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {allCategories.map((category) => (
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                key={category}
                className="group"
              >
                <Card className="overflow-hidden relative h-48">
                  <Image
                    src={categoryImages[category]?.src || "https://placehold.co/600x400.png"}
                    alt={category}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={categoryImages[category]?.hint || category.toLowerCase()}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h3 className="text-white text-lg font-bold text-center drop-shadow-lg">
                      {category}
                    </h3>
                  </div>
                </Card>
              </Link>
            ))}
        </div>
      </section>

      {/* Purchase Confirmation Dialog */}
      <Dialog
        open={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
      >
        <DialogContent className="sm:max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              Confirm Purchase
            </DialogTitle>
            <DialogDescription>
              Confirm your shipping details for "{product.name}".
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="pr-6 -mr-6">
            <div className="space-y-4 py-4 pr-6">
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
              <div className="flex justify-between items-center text-sm">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Shipping</span>
                <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </ScrollArea>
           <DialogFooter className="mt-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button
                  variant="destructive"
                  onClick={() => handlePayment("Online")}
                  disabled={!isAddressValid || isPlacingOrder}
                >
                  {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  Pay Online
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePayment("COD")}
                  disabled={!isAddressValid || isPlacingOrder}
                >
                  {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  Cash on Delivery
                </Button>
              </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
