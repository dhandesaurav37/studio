
"use client";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/use-store";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useStore();

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Your Wishlist
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your favorite items, saved for later.
        </p>
      </div>

      {wishlist.length > 0 ? (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="wishlist"
              onRemove={handleRemoveFromWishlist}
            />
          ))}
        </main>
      ) : (
        <div className="col-span-full text-center py-20 border-2 border-dashed rounded-lg w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
          <p className="text-muted-foreground mt-2">
            Save your favorite items to view them here later.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Discover Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
