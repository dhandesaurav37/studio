
"use client";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/use-store";
import Link from "next/link";

export default function PremiumProductsPage() {
  const { premiumProducts } = useStore();

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Premium Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Elevate your style with our premium apparel and accessories, crafted with the finest materials.
        </p>
      </div>

      {premiumProducts.length > 0 ? (
        <main className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {premiumProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      ) : (
        <div className="col-span-full text-center py-20 border-2 border-dashed rounded-lg w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold">No Premium Products Found</h2>
          <p className="text-muted-foreground mt-2">
            Our premium collection is currently empty. Please check back later.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
