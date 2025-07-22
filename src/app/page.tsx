
"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/data";
import { Archive, Shirt, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card } from "@/components/ui/card";
import { useStore } from "@/hooks/use-store";

const heroImages = [
  { src: "https://placehold.co/1600x900.png", hint: "fashion models" },
  { src: "https://placehold.co/1600x900.png", hint: "mens fashion" },
  { src: "https://placehold.co/1600x900.png", hint: "stylish clothing" },
  { src: "https://placehold.co/1600x900.png", hint: "modern apparel" },
  { src: "https://placehold.co/1600x900.png", hint: "urban fashion" },
  { src: "https://placehold.co/1600x900.png", hint: "premium fabric" },
];

export default function HomePage() {
  const { products } = useStore();
  const newArrivals = products.slice(0, 4);
  const oversizeTees = products.filter(p => p.category === "Oversized T-shirts");
  const premiumCollection = products.filter(p => ["Belts", "Bags", "Wallets", "Shoes", "Jackets"].includes(p.category) && p.price > 8000);

  const allCategories = [...new Set(products.map((p) => p.category))];

  const categoryImages: { [key: string]: { src: string; hint: string } } = {
    "T-Shirts": { src: "https://placehold.co/600x400.png", hint: "t-shirts" },
    "Shirts": { src: "https://placehold.co/600x400.png", hint: "dress shirts" },
    "Jeans": { src: "https://placehold.co/600x400.png", hint: "denim jeans" },
    "Sweater": { src: "https://placehold.co/600x400.png", hint: "knit sweater" },
    "Jackets": { src: "https://placehold.co/600x400.png", hint: "stylish jacket" },
    "Oversized T-shirts": { src: "https://placehold.co/600x400.png", hint: "oversized t-shirt" },
    "Track Pants": { src: "https://placehold.co/600x400.png", hint: "track pants" },
    "Belts": { src: "https://placehold.co/600x400.png", hint: "leather belt" },
    "Bags": { src: "https://placehold.co/600x400.png", hint: "canvas bag" },
    "Wallets": { src: "https://placehold.co/600x400.png", hint: "leather wallet" },
    "Shoes": { src: "https://placehold.co/600x400.png", hint: "leather shoes" },
  };

  const ProductCarousel = ({
    products,
  }: {
    products: Product[];
  }) => (
    <Carousel
      opts={{
        align: "start",
        loop: products.length > 4,
      }}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1 h-full">
              <ProductCard product={product} className="h-full" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
    </Carousel>
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] bg-background">
        <Carousel
          className="w-full h-full"
          plugins={[
            Autoplay({
              delay: 10000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-full">
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={image.src}
                    alt={`Hero image ${index + 1}`}
                    fill
                    className="object-cover"
                    data-ai-hint={image.hint}
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white bg-black/20 hover:bg-black/40 h-10 w-10" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white bg-black/20 hover:bg-black/40 h-10 w-10" />
        </Carousel>
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight leading-tight">
              Define Your Style
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
              Timeless style, uncompromising quality, and conscious craftsmanship
              for the modern individual.
            </p>
            <Button asChild size="lg" className="mt-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              <Link href="/products">Shop New Arrivals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card w-full">
        <div className="py-16 md:py-20">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 text-center">
                <div className="flex flex-col items-center gap-4">
                <Archive className="h-10 w-10 text-destructive" />
                <div>
                    <h3 className="text-xl font-semibold font-headline mb-2">
                    Exclusive Designs
                    </h3>
                    <p className="text-muted-foreground max-w-xs">
                    Curated pieces you won&apos;t find anywhere else.
                    </p>
                </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                <Shirt className="h-10 w-10 text-destructive" />
                <div>
                    <h3 className="text-xl font-semibold font-headline mb-2">
                    Premium Quality
                    </h3>
                    <p className="text-muted-foreground max-w-xs">
                    Crafted from the finest materials for lasting comfort.
                    </p>
                </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                <Truck className="h-10 w-10 text-destructive" />
                <div>
                    <h3 className="text-xl font-semibold font-headline mb-2">
                    Fast Shipping
                    </h3>
                    <p className="text-muted-foreground max-w-xs">
                    Get your new look delivered to your door in days.
                    </p>
                </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-20 bg-background w-full">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              New Arrivals
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Fresh threads, just landed. Check out the latest additions to the White Wolf collection.
            </p>
          </div>
          <ProductCarousel products={newArrivals} />
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Oversize Tees Section */}
      <section className="py-16 md:py-20 bg-card w-full">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Oversize Tees
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Discover our collection of relaxed, comfortable, and stylish oversized t-shirts.
            </p>
          </div>
          <ProductCarousel products={oversizeTees} />
           <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/products?category=Oversized+T-shirts">View All Oversize Tees</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Collection Section */}
      <section className="py-16 md:py-20 bg-background w-full">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Our Premium Collection
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Elevate your style with our premium accessories, crafted with the finest materials.
            </p>
          </div>
          <ProductCarousel products={premiumCollection} />
           <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/products?category=Belts&category=Bags&category=Wallets">View All Accessories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 md:py-20 bg-card w-full">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Explore our diverse range of apparel and accessories, categorized for your convenience.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {allCategories.map((category) => (
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                key={category}
                className="group"
              >
                <Card className="overflow-hidden relative h-48">
                  <Image
                    src={categoryImages[category]?.src || "https://placehold.co/600x400.png"}
                    alt={category}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={categoryImages[category]?.hint || category.toLowerCase()}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h3 className="text-white text-lg font-bold text-center drop-shadow-lg">
                      {category}
                    </h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

    
