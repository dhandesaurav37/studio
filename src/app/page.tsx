
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
import React from "react";

export default function HomePage() {
  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(3, 11);
  const oversizedTees = products.filter(
    (p) => p.category === "Oversized T-shirts"
  );

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

  const heroSlides = [
    {
      title: "Summer Styles",
      subtitle: "URBAN ESSENTIALS",
      image: "https://placehold.co/1600x900",
      dataAiHint: "male fashion model",
    },
    {
      title: "New Arrivals",
      subtitle: "FRESH & BOLD",
      image: "https://placehold.co/1600x900",
      dataAiHint: "female fashion model",
    },
    {
      title: "Timeless Classics",
      subtitle: "CRAFTED FOR YOU",
      image: "https://placehold.co/1600x900",
      dataAiHint: "clothing rack",
    },
    {
      title: "Premium Quality",
      subtitle: "UNMATCHED COMFORT",
      image: "https://placehold.co/1600x900",
      dataAiHint: "fabric texture",
    },
    {
      title: "The Perfect Fit",
      subtitle: "TAILORED ELEGANCE",
      image: "https://placehold.co/1600x900",
      dataAiHint: "person wearing suit",
    },
    {
      title: "Explore The Collection",
      subtitle: "DEFINE YOUR STYLE",
      image: "https://placehold.co/1600x900",
      dataAiHint: "stylish outfit",
    },
  ];

  const ProductCarousel = ({
    products,
    itemsToShow = 4,
  }: {
    products: typeof featuredProducts;
    itemsToShow?: number;
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
      <section className="relative w-full h-[80vh] overflow-hidden group">
        <Carousel
          className="w-full h-full"
          plugins={[
            Autoplay({
              delay: 12000,
            }),
          ]}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    data-ai-hint={slide.dataAiHint}
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                    <h1 className="text-sm font-light uppercase tracking-[0.3em] mb-2">
                      {slide.title}
                    </h1>
                    <p className="text-4xl md:text-6xl font-bold font-headline">
                      {slide.subtitle}
                    </p>
                    <Button asChild className="mt-8">
                      <Link href="/products">
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white bg-black/20 hover:bg-black/40 border-none opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white bg-black/20 hover:bg-black/40 border-none opacity-0 group-hover:opacity-100 transition-opacity" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
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

    