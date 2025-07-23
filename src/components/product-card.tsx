
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "wishlist";
  onRemove?: (productId: string) => void;
  className?: string;
}

export function ProductCard({
  product,
  variant = "default",
  onRemove,
  className,
}: ProductCardProps) {
  const {
    addToCart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    calculateDiscountedPrice,
    getApplicableOffer,
  } = useStore();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const discountedPrice = calculateDiscountedPrice(product);
  const hasOffer = getApplicableOffer(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent link navigation
    const defaultSize = product.sizes?.[0];
    if (!defaultSize) {
        toast({
            title: "Product Unavailable",
            description: "This product does not have any sizes available.",
            variant: "destructive",
        });
        return;
    }
    addToCart({ product, quantity: 1, size: defaultSize });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent link navigation
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

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRemove?.(product.id);
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Card
      className={cn(
        "w-full overflow-hidden group border-2 border-transparent hover:border-primary transition-colors duration-300 flex flex-col h-full bg-card",
        className
      )}
    >
      <CardContent className="p-0 relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={product.images[currentImageIndex]}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-500"
              data-ai-hint={product.dataAiHint}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        </Link>
        {product.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
         <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {variant === "wishlist" ? (
                <Button
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9"
                    onClick={handleRemoveClick}
                >
                    <X className="h-4 w-4" />
                </Button>
            ) : (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-background/50 hover:bg-background/80"
                        onClick={handleWishlistToggle}
                    >
                        <Heart
                            className={cn(
                                "h-5 w-5 text-foreground",
                                isWishlisted && "fill-destructive text-destructive"
                            )}
                        />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-background/50 hover:bg-background/80"
                        onClick={handleAddToCart}
                    >
                        <ShoppingBag className="h-5 w-5 text-foreground" />
                    </Button>
                </>
            )}
        </div>
        {hasOffer && (
           <Badge variant="destructive" className="absolute top-2 left-2">
                {hasOffer.discountType === 'percentage' ? `${hasOffer.discountValue}% OFF` : `₹${hasOffer.discountValue} OFF`}
           </Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 flex flex-col items-start bg-card mt-auto">
        <p className="text-sm font-semibold text-muted-foreground">{product.brand}</p>
        <Link href={`/products/${product.id}`} className="w-full">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm capitalize">
          {product.category.replace("-", " ")}
        </p>
        <div className="flex items-baseline gap-2 w-full mt-2">
           <p className="font-bold text-xl">₹{discountedPrice.toFixed(2)}</p>
           {hasOffer && (
             <p className="text-muted-foreground line-through text-sm">₹{product.price.toFixed(2)}</p>
           )}
        </div>
      </CardFooter>
    </Card>
  );
}
