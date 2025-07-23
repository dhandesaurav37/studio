
import { useStore } from "@/hooks/use-store";
import { notFound } from "next/navigation";
import ProductDetailClientPage from "./client-page";
import { Product, initialProducts } from "@/lib/data";

// This page now works in a standard Next.js environment (not static export)

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // NOTE: In a real-world scenario with a server, you'd fetch this data from your database here.
  // For this project, we simulate this by combining initial static data with client-side store data.
  // This approach is not ideal for production but works for this project's setup.
  const { products } = useStore.getState();
  
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
