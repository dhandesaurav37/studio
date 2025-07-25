
import { initialProducts } from "@/lib/data";
import ProductsPageClient from "./client-page";

export default function ProductsPage() {
  // In a real app with a backend, you might fetch initial products here.
  // For this project, all product logic is handled client-side via the store.
  return <ProductsPageClient />;
}
