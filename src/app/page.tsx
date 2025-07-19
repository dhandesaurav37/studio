"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { products } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const heroFeatures = [
  "4-WAY STRETCH",
  "PREMIUM FABRIC",
  "WRINKLE RESISTANCE",
];

const innovationLabItems = [
  {
    title: "Craft meets complexity",
    description: "Every pattern is engineered on a loom, not stamped by machines",
    image: "https://placehold.co/800x600",
    dataAiHint: "fabric loom",
  },
  {
    title: "Woven, not printed",
    description: "Jacquard fabrics tell their story thread by thread",
    image: "https://placehold.co/800x600",
    dataAiHint: "textile weaving",
  },
  {
    title: "Timeless texture",
    description:
      "Jacquard fabrics bring depth, dimension, and heritage to every garment",
    image: "https://placehold.co/800x600",
    dataAiHint: "red fabric",
  },
];

export default function Home() {
  const heroProducts = products.filter((p) => p.category === "pants");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {heroProducts.map((product, index) => (
                    <CarouselItem key={product.id}>
                      <div className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center">
                        <Image
                          src={product.images[index % product.images.length]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          data-ai-hint={product.dataAiHint}
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                        <div className="relative z-10 flex flex-col items-start p-8 md:p-12 text-white self-center text-left">
                          <h2 className="text-4xl md:text-6xl font-light tracking-wider">
                            NOT JUST PANTS
                          </h2>
                          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                            SUPER PANTS
                          </h1>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
              </Carousel>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-secondary">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="https://placehold.co/600x800"
                  alt="Super Pants"
                  fill
                  className="object-contain"
                  data-ai-hint="black pants"
                />
              </div>
              <div className="flex space-x-2 mt-4">
                <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-primary"></div>
                <div className="w-6 h-6 rounded-full bg-amber-900"></div>
                <div className="w-6 h-6 rounded-full bg-black"></div>
              </div>
              <div className="mt-8 space-y-6 self-start w-full">
                {heroFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-wider">
                      {feature}
                    </span>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Lab Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            INNOVATION LAB
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {innovationLabItems.map((item, index) => (
              <Link href="#" key={index}>
                <div className="relative group h-80 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    data-ai-hint={item.dataAiHint}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end text-white p-6 text-left">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
