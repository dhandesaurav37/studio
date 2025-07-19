
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const categories = [
  "All",
  "T-Shirts",
  "Oversized T-shirts",
  "Shirts",
  "Jeans",
  "Trousers",
  "Sweater",
  "SweatShirts",
  "Track Pants",
  "Boxers",
  "Jackets",
  "Sock's",
  "Shoes",
  "Bags",
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get("category") || "All";

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", newCategory.toLowerCase().replace(" ", "-"));
    }
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    router.push(`${pathname}?${params.toString()}`);
  }

  const filteredProducts =
    category !== "All"
      ? products.filter(
          (p) => p.category.toLowerCase().replace(" ", "-") === category
        )
      : products;

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline capitalize">
          {category === "All" ? "All Products" : category.replace("-", " ")}
        </h1>
        <div className="flex items-center gap-4 self-stretch md:self-auto w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 md:flex-none">
                Categories <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onSelect={() => handleCategoryChange(cat)}
                  className={category.toLowerCase().replace(" ", "-") === cat.toLowerCase().replace(" ", "-") ? "font-bold bg-accent" : ""}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select defaultValue="newest" onValueChange={handleSortChange}>
            <SelectTrigger className="w-full flex-1 md:w-[180px]">
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

      <main>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
  );
}
