
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

interface ProductDetailClientPageProps {
  product: Product;
  relatedProducts: Product[];
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  const handlePayment = (method: "Online" | "COD") => {
    setIsPurchaseDialogOpen(false);
    toast({
        title: "Order Placed!",
        description: `Your order for ${product.name} will be processed shortly. Payment via ${method}.`
    });
    router.push('/orders');
  }

  const hasAddress = profile.address?.street && profile.address?.city;
  const hasMobile = !!profile.mobile;

  return (
    <div className="container py-8 md:py-12 px-4 sm:px-6 lg:px-8">
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
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Confirm Purchase</DialogTitle>
            <DialogDescription>
              Confirm your shipping details for "{product.name}".
            </DialogDescription>
          </DialogHeader>
          <RadioGroup defaultValue="default-address" className="space-y-4">
            <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="default-address" id="default-address" />
                        <Label htmlFor="default-address" className="font-semibold cursor-pointer">Use Default Address</Label>
                    </div>
                     <Button variant="outline" size="sm" asChild>
                       <Link href="/profile"><Edit className="mr-2 h-3 w-3" />Change</Link>
                    </Button>
                </div>
                 <div className="text-sm text-muted-foreground mt-3 pl-8 space-y-1">
                  {hasAddress || hasMobile ? (
                    <>
                      {hasAddress ? (
                         <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{profile.address.street}, {profile.address.city}, {profile.address.state} - {profile.address.pincode}</span>
                         </div>
                      ) : (
                         <p className="text-destructive">No address found. Please add one in your profile.</p>
                      )}
                    </>
                  ) : (
                     <p className="text-destructive">No default address and/or phone number found. Please add them in your profile.</p>
                  )}
                 </div>
            </div>
             <div className="rounded-lg border p-4 flex items-center gap-3">
                 <RadioGroupItem value="new-address" id="new-address" disabled />
                 <Label htmlFor="new-address" className="font-semibold cursor-pointer text-muted-foreground">Ship to a New Address</Label>
            </div>
          </RadioGroup>
          <Separator />
          <div className="flex justify-between items-center">
             <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">₹{(product.price * quantity).toFixed(2)}</p>
             </div>
             <div className="relative h-20 w-20 rounded-md overflow-hidden">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" data-ai-hint={product.dataAiHint} />
             </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
                <Button variant="destructive" onClick={() => handlePayment("Online")} disabled={!hasAddress || !hasMobile}>Pay Online</Button>
                <Button variant="secondary" onClick={() => handlePayment("COD")} disabled={!hasAddress || !hasMobile}>Cash on Delivery</Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
