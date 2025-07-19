import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, X } from "lucide-react";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "wishlist";
  onRemove?: (productId: string) => void;
}

export function ProductCard({
  product,
  variant = "default",
  onRemove,
}: ProductCardProps) {
  return (
    <Card className="w-full overflow-hidden group border-2 border-transparent hover:border-primary transition-colors duration-300 flex flex-col h-full bg-card">
      <Link href={`/products/${product.id}`} className="block">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-500"
              data-ai-hint={product.dataAiHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {variant === "default" && (
              <Badge variant="secondary" className="absolute top-3 right-3">
                New
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 flex flex-col items-start bg-card mt-auto">
        <Link href={`/products/${product.id}`} className="w-full">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm capitalize">
          {product.category.replace("-", " ")}
        </p>
        <div className="flex items-center justify-between w-full mt-4">
          <p className="font-bold text-xl">${product.price.toFixed(2)}</p>
          {variant === "wishlist" ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove?.(product.id)}
            >
              <X className="mr-2 h-4 w-4" /> Remove
            </Button>
          ) : (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/20"
              >
                <Heart className="h-5 w-5 text-accent" />
                <span className="sr-only">Add to Wishlist</span>
              </Button>
              <Button variant="outline" size="icon">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Add to Cart</span>
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
