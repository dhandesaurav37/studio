
"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import { ArrowRight } from "lucide-react";
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
import React from "react";

export default function HomePage() {
  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(3, 11);
  const oversizedTees = products.filter(
    (p) => p.category === "Oversized T-shirts"
  );

  const heroSlides = [
    {
      src: "https://placehold.co/1800x900",
      hint: "fashion model",
      leftText: "PREMIUM COLLECTION",
      rightText: "DISCOVER THE NEW ARRIVALS",
    },
    {
      src: "https://placehold.co/1800x900",
      hint: "mens fashion",
      leftText: "SUMMER STYLES",
      rightText: "LIGHTWEIGHT & BREATHABLE",
    },
    {
      src: "https://placehold.co/1800x900",
      hint: "stylish clothing",
      leftText: "URBAN ESSENTIALS",
      rightText: "SHOP THE LOOK",
    },
    {
      src: "https://placehold.co/1800x900",
      hint: "apparel collection",
      leftText: "CRAFTED FOR COMFORT",
      rightText: "MADE WITH PREMIUM MATERIALS",
    },
    {
      src: "https://placehold.co/1800x900",
      hint: "modern outfits",
      leftText: "MINIMALIST DESIGN",
      rightText: "TIMELESS APPAREL",
    },
    {
      src: "https://placehold.co/1800x900",
      hint: "urban style",
      leftText: "WHITE WOLF CO.",
      rightText: "JOIN THE PACK",
    },
  ];

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
            className="sm:basis-1/2 lg:basis-1/3"
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
      <section className="relative h-[100vh] w-full">
        <Carousel
          className="w-full h-full"
          plugins={[
            Autoplay({
              delay: 12000,
              stopOnInteraction: true,
            }),
          ]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="h-full relative">
                <Image
                  src={slide.src}
                  alt={`Hero background ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                  data-ai-hint={slide.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
                <div className="relative z-10 h-full flex items-center justify-between text-white p-8 md:p-16">
                  <div className="max-w-md text-left">
                    <h2 className="text-4xl md:text-6xl font-bold font-headline uppercase tracking-wider">
                      {slide.leftText}
                    </h2>
                    <Button asChild size="lg" className="mt-8">
                      <Link href="/products">
                        Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="max-w-xs text-right hidden md:block">
                     <p className="text-xl md:text-2xl font-semibold uppercase tracking-wide">
                        {slide.rightText}
                     </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white bg-white/10 hover:bg-white/20 border-white/20" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white bg-white/10 hover:bg-white/20 border-white/20" />
        </Carousel>
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
