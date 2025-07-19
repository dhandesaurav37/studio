import { getProductById, products } from "@/lib/data";
import { notFound } from "next/navigation";
import ProductDetailClientPage from "./client-page";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = getProductById(params.id);

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
