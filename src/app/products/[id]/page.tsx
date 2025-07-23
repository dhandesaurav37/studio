
import { useStore } from "@/hooks/use-store";
import { notFound } from "next/navigation";
import ProductDetailClientPage from "./client-page";
import { Product, initialProducts } from "@/lib/data";

export const dynamicParams = true; 

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

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { products } = useStore();
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Use a combined products list (from store and initial data) to find the product.
  // This ensures the page works both during build and on the client.
  const allProducts = (() => {
      const productMap = new Map<string, Product>();
      initialProducts.forEach(p => productMap.set(p.id, p));
      products.forEach(p => productMap.set(p.id, p));
      return Array.from(productMap.values());
  })();

  const product = (() => {
    if (!id) return undefined;
    // Prioritize store products if available, otherwise fallback to initial data
    return products.find(p => p.id === id) || initialProducts.find(p => p.id === id);
  })();

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
