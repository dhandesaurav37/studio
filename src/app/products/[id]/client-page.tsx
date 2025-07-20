
"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  } = useStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
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
            <Button size="lg" className="flex-1 w-full" onClick={handleAddToCart}>
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
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
    </div>
  );
}
