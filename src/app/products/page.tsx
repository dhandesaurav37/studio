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
import Link from "next/link";

const categories = ["All", "T-Shirts", "Shirts", "Jeans"];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");

  const category =
    rawCategory === "t-shirts"
      ? "T-Shirts"
      : rawCategory
      ? rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1)
      : "All";

  const filteredProducts =
    category !== "All"
      ? products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
      : products;

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold font-headline">
          {category.replace("-", " ")}
        </h1>
        <div className="flex items-center gap-4 self-stretch md:self-auto">
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Sort by:</span>
          <Select defaultValue="newest">
            <SelectTrigger className="w-full sm:w-[180px]">
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
                <Link
                  href={
                    cat === "All"
                      ? "/products"
                      : `/products?category=${cat.toLowerCase()}`
                  }
                  className={`text-muted-foreground hover:text-foreground transition-colors ${
                    category === cat
                      ? "font-bold text-foreground"
                      : ""
                  }`}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
          <Separator className="my-6" />
          {/* Add more filters here like size, color, price range */}
        </aside>

        <main className="md:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
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
