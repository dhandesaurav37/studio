
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRowCardProps {
  product: Product;
  className?: string;
}

export function ProductRowCard({ product, className }: ProductRowCardProps) {
  return (
    <Card
      className={cn(
        "w-full overflow-hidden group border-2 border-transparent hover:border-primary/50 transition-colors duration-300 flex flex-col md:flex-row bg-card",
        className
      )}
    >
      <Link href={`/products/${product.id}`} className="block md:w-1/4">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-500"
              data-ai-hint={product.dataAiHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardContent>
      </Link>
      <div className="p-4 sm:p-6 flex flex-col items-start justify-between flex-1">
        <div>
          <p className="text-muted-foreground text-sm capitalize mb-1">
            {product.category.replace("-", " ")}
          </p>
          <Link href={`/products/${product.id}`} className="w-full">
            <h3 className="font-bold text-2xl font-headline tracking-tight">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-xs">
              {product.rating.toFixed(1)} ({product.reviews} reviews)
            </span>
          </div>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-prose line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between w-full mt-4">
          <p className="font-bold text-3xl">${product.price.toFixed(2)}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Add to Wishlist</span>
            </Button>
            <Button size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
