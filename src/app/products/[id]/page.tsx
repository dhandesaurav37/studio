
import { useStore } from "@/hooks/use-store";
import { notFound } from "next/navigation";
import ProductDetailClientPage from "./client-page";
import { Product, initialProducts } from "@/lib/data";

export const dynamicParams = false; 

// This function is required for static export with dynamic routes.
// It tells Next.js which pages to generate at build time based on the initial static data.
export async function generateStaticParams() {
  // At build time, we only have access to the initialProducts.
  const allIds = initialProducts.map((p) => p.id);

  return allIds.map((id) => ({
    id: id,
  }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // The store is initialized on the client, but for build we need a source of truth.
  // We combine the store's products with the initial static products.
  const { products } = useStore();
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Create a comprehensive map of all products (from store and initial data)
  // to find the product. This ensures the page works both during build and on the client.
  const allProducts = (() => {
      const productMap = new Map<string, Product>();
      initialProducts.forEach(p => productMap.set(p.id, p));
      // The `products` from `useStore` will be populated on the client side
      products.forEach(p => productMap.set(p.id, p));
      return Array.from(productMap.values());
  })();

  const product = allProducts.find(p => p.id === id);

  if (!product) {
    // This will show a 404 page if a product ID is invalid.
    notFound();
  }

  // Helper function to find the "base" name of a product for finding similar items.
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

  // Find other products from the same category, excluding the current one and similar ones.
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
