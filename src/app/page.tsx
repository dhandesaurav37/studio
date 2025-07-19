import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
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

export default function Home() {
  const newArrivals = products.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        <Image
          src="https://placehold.co/1920x1080"
          alt="Model wearing White Wolf apparel"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint="mens fashion"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 flex flex-col items-center p-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline mb-4 tracking-tight">
            Style Redefined.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Discover premium menswear, crafted with purpose and precision for
            the modern individual.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">
              Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section id="new-arrivals" className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            New Arrivals
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {newArrivals.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group h-96 overflow-hidden rounded-lg">
              <Image
                src="https://placehold.co/800x600"
                alt="T-Shirt Collection"
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-500"
                data-ai-hint="t-shirts"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <h3 className="text-3xl font-bold font-headline">
                  The Tee Collection
                </h3>
                <Button variant="secondary" className="mt-4" asChild>
                  <Link href="/products?category=t-shirts">Shop Now</Link>
                </Button>
              </div>
            </div>
            <div className="relative group h-96 overflow-hidden rounded-lg">
              <Image
                src="https://placehold.co/800x600"
                alt="Denim Collection"
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-500"
                data-ai-hint="denim"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <h3 className="text-3xl font-bold font-headline">
                  The Denim Edit
                </h3>
                <Button variant="secondary" className="mt-4" asChild>
                  <Link href="/products?category=jeans">Shop Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="our-story" className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                The White Wolf Way
              </h2>
              <p className="mb-4 text-primary-foreground/80">
                White Wolf was founded on the principle that clothing should be
                more than just functional; it should be an extension of your
                identity. We believe in timeless style, uncompromising quality,
                and conscious craftsmanship.
              </p>
              <p className="text-primary-foreground/80">
                Each piece in our collection is thoughtfully designed and
                meticulously constructed using only the finest materials. We
                are for those who lead, not follow—the lone wolves who carve
                their own path.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src="https://placehold.co/800x600"
                alt="Craftsmanship"
                layout="fill"
                objectFit="cover"
                data-ai-hint="fabric tailor"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
