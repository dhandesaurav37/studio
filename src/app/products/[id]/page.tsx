
"use client";

import { useStore } from "@/hooks/use-store";
import { notFound, useParams } from "next/navigation";
import ProductDetailClientPage from "./client-page";
import { useEffect, useState } from "react";
import { Product } from "@/lib/data";

export default function ProductDetailPage() {
  const params = useParams();
  const { getProductById, products } = useStore();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      setProduct(getProductById(id));
    }
  }, [id, getProductById]);


  if (product === undefined) {
    // Loading state, maybe return a skeleton loader here
    return <div>Loading...</div>;
  }

  if (!product) {
    notFound();
  }

  const getProductNameRoot = (name: string) => {
    // Simple logic to get a "base" name, e.g., "Charcoal Crew-Neck Tee" -> "Crew-Neck Tee"
    const commonWords = ["t-shirt", "tee", "shirt", "jeans", "sweater", "jacket", "pants", "overcoat", "loafers", "belt", "wallet", "bag"];
    for (const word of commonWords) {
        if (name.toLowerCase().includes(word)) {
            return name.substring(name.toLowerCase().indexOf(word));
        }
    }
    return name;
  };

  const productNameRoot = getProductNameRoot(product.name);
  
  const potentialProducts = product.price <= 4000 
    ? products.filter(p => p.price <= 4000)
    : products;

  const relatedProducts = potentialProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
        const aIsSimilarName = getProductNameRoot(a.name) === productNameRoot;
        const bIsSimilarName = getProductNameRoot(b.name) === productNameRoot;
        const aIsSameCategory = a.category === product.category;
        const bIsSameCategory = b.category === product.category;

        if (aIsSimilarName && !bIsSimilarName) return -1;
        if (!aIsSimilarName && bIsSimilarName) return 1;
        if (aIsSameCategory && !bIsSameCategory) return -1;
        if (!aIsSameCategory && bIsSameCategory) return 1;
        
        return 0; // Or other fallback sorting like rating
    })
    .slice(0, 4);


  return (
    <ProductDetailClientPage
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

    
