import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import Link from "next/link";

const wishlistItems = products.slice(3, 6);

export default function WishlistPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        Your Wishlist
      </h1>
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
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
