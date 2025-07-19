
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
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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

const sizeOrder = ["S", "M", "L", "XL", "XXL"];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get("category") || "All";
  const searchTerm = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "price-asc";

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
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    const term = event.target.value;
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const getMinSizeIndex = (sizes: string[]) => {
    let minIndex = Infinity;
    for (const size of sizes) {
      const index = sizeOrder.indexOf(size);
      if (index !== -1 && index < minIndex) {
        minIndex = index;
      }
    }
    return minIndex;
  }

  const filteredProducts = products
    .filter((p) =>
      category !== "All"
        ? p.category.toLowerCase().replace(" ", "-") === category
        : true
    )
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sort) {
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "size":
            return getMinSizeIndex(a.sizes) - getMinSizeIndex(b.sizes);
        case "price-asc":
        default:
          return a.price - b.price;
      }
    });

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline capitalize">
          {category === "All" ? "All Products" : category.replace("-", " ")}
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 self-stretch md:self-auto w-full md:w-auto">
          <div className="relative w-full sm:w-auto flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Categories <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    onSelect={() => handleCategoryChange(cat)}
                    className={
                      category.toLowerCase().replace(" ", "-") ===
                      cat.toLowerCase().replace(" ", "-")
                        ? "font-bold bg-accent"
                        : ""
                    }
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
