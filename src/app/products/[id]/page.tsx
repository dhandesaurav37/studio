
"use client";

import { useStore } from "@/hooks/use-store";
import { notFound, useParams } from "next/navigation";
import ProductDetailClientPage from "./client-page";
import { useEffect, useState, useMemo } from "react";
import { Product, initialProducts } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

// This function is required for static export with dynamic routes.
// It tells Next.js which pages to generate at build time.
// NOTE: This uses the `initialProducts` list as a fallback for build-time generation.
// The live data will still be fetched from Firebase on the client side.
export async function generateStaticParams() {
  // In a real-world scenario with a proper backend, you would fetch all product IDs here.
  // For now, we'll use the initialProducts from our data file.
  return initialProducts.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage() {
  const params = useParams();
  const { getProductById, products } = useStore();
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Use a combined products list (from store and initial data) to find the product.
  // This ensures the page works both during build and on the client.
  const allProducts = useMemo(() => {
      const productMap = new Map<string, Product>();
      initialProducts.forEach(p => productMap.set(p.id, p));
      products.forEach(p => productMap.set(p.id, p));
      return Array.from(productMap.values());
  }, [products]);

  const product = useMemo(() => {
    if (!id) return undefined;
    if (products.length > 0) {
      return getProductById(id);
    }
    // Fallback for initial render or if store is not populated yet
    return initialProducts.find(p => p.id === id);
  }, [id, getProductById, products]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false);
    }
  }, [products]);


  if (isLoading && !product) {
    return (
        <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-10 w-16" />
                        <Skeleton className="h-10 w-16" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (!product) {
    notFound();
  }

  const getProductNameRoot = (name: string) => {
    const commonWords = ["t-shirt", "tee", "shirt", "jeans", "sweater", "jacket", "pants", "overcoat", "loafers", "belt", "wallet", "bag", "chinos", "polo"];
    const nameLower = name.toLowerCase();
    for (const word of commonWords) {
        if (nameLower.includes(word)) {
            return name.substring(nameLower.indexOf(word));
        }
    }
    const words = name.split(" ");
    if (words.length > 1) {
      return words.slice(1).join(" ");
    }
    return name;
  };

  const productNameRoot = getProductNameRoot(product.name);
  
  const similarProducts = allProducts
    .filter((p) => p.id !== product.id && getProductNameRoot(p.name) === productNameRoot)
    .slice(0, 4);

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && !similarProducts.some(sp => sp.id === p.id) && p.category === product.category)
    .slice(0, 4);


  return (
    <ProductDetailClientPage
      product={product}
      similarProducts={similarProducts}
      relatedProducts={relatedProducts}
    />
  );
}
