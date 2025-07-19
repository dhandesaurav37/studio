
"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import { ArrowRight, Gem, ShieldCheck, Truck } from "lucide-react";
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
      imageSrc: "https://placehold.co/1600x900.png",
      dataAiHint: "fashion model",
      title: "Exquisite Craftsmanship",
      subtitle:
        "Our apparel is meticulously crafted with an unwavering commitment to quality and timeless design.",
      buttonText: "Discover the Collection",
      href: "/products",
    },
    {
      imageSrc: "https://placehold.co/1600x900.png",
      dataAiHint: "luxury clothing",
      title: "Modern Elegance",
      subtitle:
        "Explore a curated selection where contemporary style meets classic sophistication.",
      buttonText: "Shop New Arrivals",
      href: "/products?sort=newest",
    },
    {
      imageSrc: "https://placehold.co/1600x900.png",
      dataAiHint: "stylish apparel",
      title: "Unparalleled Quality",
      subtitle:
        "Experience the difference of premium materials and conscious craftsmanship in every piece.",
      buttonText: "Learn Our Story",
      href: "/about",
    },
  ];

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
            className="sm:basis-1/2 md:basis-1/3 xl:basis-1/4"
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
      <section className="relative w-full h-[80vh] bg-background">
        <Carousel
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          opts={{
            loop: true,
          }}
          className="w-full h-full"
        >
          <CarouselContent>
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    data-ai-hint={slide.dataAiHint}
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                    <div className="container text-white">
                      <div className="max-w-2xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
                          {slide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 mb-8">
                          {slide.subtitle}
                        </p>
                        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Link href={slide.href}>
                            {slide.buttonText}{" "}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
           <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-background/50 hover:bg-background/80 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-background/50 hover:bg-background/80 hidden md:flex" />
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="bg-card text-card-foreground py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-12">
            <div className="flex items-start gap-4">
              <Gem className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold font-headline mb-2">
                  Exclusive Designs
                </h3>
                <p className="text-muted-foreground">
                  Unique pieces you won't find anywhere else.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold font-headline mb-2">
                  Premium Quality
                </h3>
                <p className="text-muted-foreground">
                  Crafted from the finest materials for lasting comfort.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Truck className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold font-headline mb-2">
                  Fast Shipping
                </h3>
                <p className="text-muted-foreground">
                  Get your new favorite styles delivered to your door quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 md:py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            Featured Collection
          </h2>
          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-card text-card-foreground py-16 md:py-20">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="https://placehold.co/600x750.png"
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
      <section className="py-16 md:py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            New Arrivals
          </h2>
          <ProductCarousel products={newArrivals} />
          <div className="text-center mt-12">
            <Button asChild variant="secondary" size="lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Oversize Tees Section */}
      <section className="py-16 md:py-20 bg-card text-card-foreground">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            Oversize Tees
          </h2>
          <ProductCarousel products={oversizedTees} />
          <div className="text-center mt-12">
            <Button asChild variant="secondary" size="lg">
              <Link href="/products?category=Oversized+T-shirts">
                Shop Oversize Tees
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 uppercase tracking-wider">
            Shop By Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group text-center"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={category.imageSrc}
                    alt={`A model wearing a ${category.name}`}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={category.dataAiHint}
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors capitalize">
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
