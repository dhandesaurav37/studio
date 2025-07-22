
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
    const commonWords = ["t-shirt", "tee", "shirt", "jeans", "sweater", "jacket", "pants", "overcoat", "loafers", "belt", "wallet", "bag", "chinos", "polo"];
    const nameLower = name.toLowerCase();
    for (const word of commonWords) {
        if (nameLower.includes(word)) {
            return name.substring(nameLower.indexOf(word));
        }
    }
    // Fallback for names without common words, e.g., "Classic Leather Belt" -> "Leather Belt"
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

    
