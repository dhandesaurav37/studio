
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/lib/data";
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
import { ListFilter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/hooks/use-store";

const alphaSizes = ["S", "M", "L", "XL", "XXL"];
const numericSizes = ["30", "32", "34", "36", "38"];

export default function ProductsPage() {
  const { shopProducts } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const allCategories = [...new Set(shopProducts.map((p) => p.category))];
  const allColors = [...new Set(shopProducts.flatMap((p) => p.color).filter(Boolean) as string[])];
  const allBrands = [...new Set(shopProducts.map((p) => p.brand))];

  const category = searchParams.get("category") || "All";
  const color = searchParams.get("color") || "All";
  const brand = searchParams.get("brand") || "All";
  const alphaSize = searchParams.get("alphaSize") || "All";
  const numericSize = searchParams.get("numericSize") || "All";
  const searchTerm = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "price-asc";

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete(filterType);
    } else {
      params.set(filterType, value);
    }
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

  const filteredProducts = shopProducts
    .filter((p: Product) => (category !== "All" ? p.category === category : true))
    .filter((p: Product) => (color !== "All" ? p.color === color : true))
    .filter((p: Product) => (brand !== "All" ? p.brand === brand : true))
    .filter((p: Product) => (alphaSize !== "All" ? p.sizes.includes(alphaSize) : true))
    .filter((p: Product) => (numericSize !== "All" ? p.sizes.includes(numericSize) : true))
    .filter((p: Product) => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
     )
    .sort((a, b) => {
      switch (sort) {
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "price-asc":
        default:
          return a.price - b.price;
      }
    });

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Shop Our Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our curated selection of high-quality apparel and accessories.
        </p>
      </div>

      {/* Filters and Search Section */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products or brands..."
            className="pl-10 w-full h-12 text-base"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Select
            value={category}
            onValueChange={(val) => handleFilterChange("category", val)}
          >
            <SelectTrigger className="w-auto min-w-[160px] flex-grow sm:flex-grow-0">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {allCategories.map((cat, index) => (
                <SelectItem key={`${cat}-${index}`} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select
            value={brand}
            onValueChange={(val) => handleFilterChange("brand", val)}
          >
            <SelectTrigger className="w-auto min-w-[140px] flex-grow sm:flex-grow-0">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Brands</SelectItem>
              {allBrands.map((b, index) => (
                <SelectItem key={`${b}-${index}`} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select
            value={color}
            onValueChange={(val) => handleFilterChange("color", val)}
          >
            <SelectTrigger className="w-auto min-w-[140px] flex-grow sm:flex-grow-0">
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Colors</SelectItem>
              {allColors.map((c, index) => (
                <SelectItem key={`${c}-${index}`} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={alphaSize}
            onValueChange={(val) => handleFilterChange("alphaSize", val)}
          >
            <SelectTrigger className="w-auto min-w-[160px] flex-grow sm:flex-grow-0">
              <SelectValue placeholder="Alpha Sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Alpha Sizes</SelectItem>
              {alphaSizes.map((size, index) => (
                <SelectItem key={`${size}-${index}`} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select
            value={numericSize}
            onValueChange={(val) => handleFilterChange("numericSize", val)}
          >
            <SelectTrigger className="w-auto min-w-[170px] flex-grow sm:flex-grow-0">
              <SelectValue placeholder="Numeric Sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Numeric Sizes</SelectItem>
              {numericSizes.map((size, index) => (
                <SelectItem key={`${size}-${index}`} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-auto flex-grow sm:flex-grow-0">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => handleFilterChange("sort", "price-asc")}>
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleFilterChange("sort", "price-desc")}>
                  Price: High to Low
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => handleFilterChange("sort", "rating")}>
                  Top Rated
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <main className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-center">
        {filteredProducts.length > 0 ? (
          <>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </>
        ) : (
           <div className="col-span-full text-center py-20 border-2 border-dashed rounded-lg w-full max-w-4xl mx-auto">
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
