
import { notFound } from "next/navigation";
import ProductDetailClientPage from "./client-page";
import { Product, initialProducts } from "@/lib/data";

// This page now works in a standard Next.js environment (not static export)
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // NOTE: In a real-world scenario with a server, you'd fetch this data from your database here.
  // For this project's setup, we can only rely on the initialProducts for the server render.
  // The client-side component will then hydrate with the full, live data from Firebase.
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Find the product from the static list available at build time.
  // This helps with initial render performance. The client will hydrate with live data.
  const product = initialProducts.find(p => p.id === id);
  const allProducts = initialProducts;

  // The notFound() call is removed. We'll let the client-side handle it if the product
  // truly doesn't exist in the live database. If a product is not found in the initial list,
  // we still render the client page, which will fetch the live data.
  if (!product) {
    // Even if not found initially, the client component will try to find it in the live data.
    // We pass a shell product object to prevent errors, the client will fetch the real one.
     const placeholderProduct: Product = {
        id: id,
        name: "Loading...",
        brand: "",
        price: 0,
        description: "",
        images: ["https://placehold.co/600x800.png"],
        category: "",
        sizes: [],
        color: "",
        rating: 0,
        reviews: 0,
        dataAiHint: "product",
    };
    return (
        <ProductDetailClientPage
          product={placeholderProduct}
          similarProducts={[]}
          relatedProducts={[]}
        />
    );
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
