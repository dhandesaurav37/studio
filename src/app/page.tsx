
"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
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

export default function HomePage() {
  const newArrivals = products.slice(0, 4);

  const ProductCarousel = ({
    products,
  }: {
    products: typeof newArrivals;
  }) => (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
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
        <div className="w-full h-full">
          <Image
            src="https://placehold.co/1600x900.png"
            alt="Hero image"
            fill
            className="object-cover"
            data-ai-hint="fashion models"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background">
        <div className="container py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg flex flex-col items-center text-center gap-4">
              <Archive className="h-10 w-10 text-destructive" />
              <div>
                <h3 className="text-xl font-semibold font-headline mb-2">
                  Exclusive Designs
                </h3>
                <p className="text-muted-foreground">
                  Curated pieces you won&apos;t find anywhere else.
                </p>
              </div>
            </div>
            <div className="bg-card p-8 rounded-lg flex flex-col items-center text-center gap-4">
              <Shirt className="h-10 w-10 text-destructive" />
              <div>
                <h3 className="text-xl font-semibold font-headline mb-2">
                  Premium Quality
                </h3>
                <p className="text-muted-foreground">
                  Crafted from the finest materials for lasting comfort.
                </p>
              </div>
            </div>
            <div className="bg-card p-8 rounded-lg flex flex-col items-center text-center gap-4">
              <Truck className="h-10 w-10 text-destructive" />
              <div>
                <h3 className="text-xl font-semibold font-headline mb-2">
                  Fast Shipping
                </h3>
                <p className="text-muted-foreground">
                  Get your new look delivered to your door in days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              New Arrivals
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Fresh threads, just landed. Check out the latest additions to the Acoof collection.
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

    </div>
  );
}
