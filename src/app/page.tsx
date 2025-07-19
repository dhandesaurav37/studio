
"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useState } from "react";
import { CountdownTimer } from "@/components/countdown-timer";

export default function HomePage() {
  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(3, 11);
  const oversizedTees = products.filter(
    (p) => p.category === "Oversized T-shirts"
  );
  
  const [selectedColor, setSelectedColor] = useState("Black");

  const colors = [
    { name: "Navy", bgColor: "bg-blue-900" },
    { name: "Brown", bgColor: "bg-yellow-900" },
    { name: "Black", bgColor: "bg-black" },
  ];

  const features = ["4-WAY STRETCH", "PREMIUM FABRIC", "WRINKLE RESISTANCE"];

  const categories = [...new Set(products.map((p) => p.category))].map(
    (category) => {
      const product = products.find((p) => p.category === category)!;
      return {
        name: category,
        href: `/products?category=${encodeURIComponent(category)}`,
        imageSrc: product.images[0],
        dataAiHint: product.dataAiHint,
      };
    }
  );

  const ProductCarousel = ({
    products,
  }: {
    products: typeof featuredProducts;
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
            className="sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
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
      {/* New Hero Section */}
      <section className="w-full bg-gray-100 dark:bg-gray-800 py-8 md:py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Carousel className="w-full h-full group" opts={{ loop: true }}>
                <CarouselContent>
                  <CarouselItem>
                    <div className="relative w-full h-[300px] md:h-full">
                      <Image
                        src="https://placehold.co/1200x800"
                        alt="Model wearing Super Pants"
                        fill
                        className="object-cover rounded-lg"
                        data-ai-hint="male model pants"
                      />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                        <div className="text-center text-white">
                          <p className="text-2xl font-light tracking-widest">NOT JUST PANTS</p>
                          <h2 className="text-6xl font-bold">SUPER PANTS</h2>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                     <div className="relative w-full h-[300px] md:h-full">
                      <Image
                        src="https://placehold.co/1200x800"
                        alt="Model wearing Super Pants"
                        fill
                        className="object-cover rounded-lg"
                        data-ai-hint="fashion model pants"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                        <div className="text-center text-white">
                           <p className="text-2xl font-light tracking-widest">NOT JUST PANTS</p>
                           <h2 className="text-6xl font-bold">SUPER PANTS</h2>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                 <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 text-white bg-black/30 hover:bg-black/50 border-none opacity-0 group-hover:opacity-100 transition-opacity" />
                 <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 text-white bg-black/30 hover:bg-black/50 border-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </Carousel>
            </div>
            <div className="bg-white dark:bg-card p-6 rounded-lg flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-[3/4] mb-6">
                   <Image
                      src="https://placehold.co/400x533"
                      alt="Super Pants product image"
                      fill
                      className="object-contain"
                      data-ai-hint="black pants"
                    />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium">Colors:</span>
                   <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`h-6 w-6 rounded-full ${color.bgColor} border-2 ${selectedColor === color.name ? 'border-primary' : 'border-transparent'}`}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="relative">
                  <Carousel opts={{align: "start", loop: true}}>
                    <CarouselContent>
                      {features.map((feature, index) => (
                        <CarouselItem key={index}>
                          <p className="text-center font-semibold text-muted-foreground tracking-wider">{feature}</p>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute -left-10 top-1/2 -translate-y-1/2 h-8 w-8" />
                    <CarouselNext className="absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8" />
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
          <CountdownTimer />
        </div>
      </section>

      {/* Featured Collection */}
      <section className="bg-background">
        <div className="container py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            Featured Collection
          </h2>
          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-card text-card-foreground py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="https://placehold.co/600x750"
              alt="Brand story"
              fill
              className="object-cover"
              data-ai-hint="clothing designer"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
              Our Philosophy
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              At White Wolf, we believe in clothing that lasts. We focus on
              timeless design, the finest materials, and impeccable
              craftsmanship.
            </p>
            <p className="text-muted-foreground mb-8">
              Our collections are designed to be versatile, comfortable, and
              effortlessly stylish. We're not about chasing trends; we're about
              creating pieces you'll love and wear for years to come.
            </p>
            <Button asChild variant="outline">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            New Arrivals
          </h2>
          <ProductCarousel products={newArrivals} />
          <div className="text-center mt-12">
            <Button asChild variant="secondary">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Oversize Tees Section */}
      <section className="py-16 md:py-24 bg-card text-card-foreground">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            Oversize Tees
          </h2>
          <ProductCarousel products={oversizedTees} />
          <div className="text-center mt-12">
            <Button asChild variant="secondary">
              <Link href="/products?category=Oversized+T-shirts">
                Shop Oversize Tees
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 uppercase tracking-wider">
            Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group text-center"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
                  <Image
                    src={category.imageSrc}
                    alt={`A model wearing a ${category.name}`}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={category.dataAiHint}
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name.replace("-", " ")}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
