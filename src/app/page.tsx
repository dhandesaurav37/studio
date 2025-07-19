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

export default function HomePage() {
  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(3, 11);
  const oversizedTees = products.filter(
    (p) => p.category === "Oversized T-shirts"
  );

  const categories = [
    ...new Set(products.map((p) => p.category)),
  ].map((category) => {
    const product = products.find((p) => p.category === category)!;
    return {
      name: category,
      href: `/products?category=${encodeURIComponent(category)}`,
      imageSrc: product.images[0],
      dataAiHint: product.dataAiHint,
    };
  });

  const ProductCarousel = ({
    products,
  }: {
    products: typeof featuredProducts;
  }) => (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
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
      <section className="relative h-[80vh] w-full flex items-center justify-center text-center">
        <Image
          src="https://placehold.co/1800x900"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
          data-ai-hint="fashion model"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
            Timeless Style, Modern Fit
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-white/80 mb-8">
            Discover our collection of premium apparel, crafted with meticulous
            attention to detail and designed for the modern individual.
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            Featured Collection
          </h2>
          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-card text-card-foreground py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full aspect-square md:aspect-[4/5] rounded-lg overflow-hidden">
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
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative flex flex-col items-center justify-end text-center rounded-lg overflow-hidden p-4 h-48 md:h-64"
              >
                <Image
                  src={category.imageSrc}
                  alt={`A model wearing a ${category.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  data-ai-hint={category.dataAiHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white group-hover:underline">
                    {category.name.replace("-", " ")}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
