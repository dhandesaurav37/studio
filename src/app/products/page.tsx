"use client";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const categories = ["All", "T-Shirts", "Shirts", "Jeans"];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-4xl font-bold font-headline mb-4 md:mb-0">
          {category
            ? category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")
            : "All Products"}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Sort by:</span>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="hidden md:block">
          <h2 className="text-lg font-semibold font-headline mb-4">
            Categories
          </h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <a
                  href={
                    cat === "All"
                      ? "/products"
                      : `/products?category=${cat.toLowerCase()}`
                  }
                  className={`text-muted-foreground hover:text-foreground ${
                    category === cat.toLowerCase() ||
                    (!category && cat === "All")
                      ? "font-bold text-foreground"
                      : ""
                  }`}
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
          <Separator className="my-6" />
          {/* Add more filters here like size, color, price range */}
        </aside>

        <main className="md:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold">No products found</h2>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
