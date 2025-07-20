
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

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <ProductDetailClientPage
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

    