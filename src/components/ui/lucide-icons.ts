"use client";

import { useStore } from "@/hooks/use-store";
import { notFound, useParams } from "next/navigation";
import ProductDetailClientPage from "./client-page";
import { useEffect, useState, useMemo } from "react";
import { Product } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const { getProductById, products } = useStore();
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const product = useMemo(() => {
    if (!id || products.length === 0) return undefined;
    return getProductById(id);
  }, [id, getProductById, products]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false);
    }
  }, [products]);


  if (isLoading) {
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
  
  const similarProducts = products
    .filter((p) => p.id !== product.id && getProductNameRoot(p.name) === productNameRoot)
    .slice(0, 4);

  const relatedProducts = products
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