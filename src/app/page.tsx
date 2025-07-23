
"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Product, Reel } from "@/lib/data";
import { Archive, PlayCircle, Shirt, Sparkles, Truck, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useMemo, useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useStore } from "@/hooks/use-store";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import type { Offer } from "@/app/admin/ads-and-offers/page";

const heroImages = [
  { src: "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/HomePage.png.jpg?alt=media&token=db086dc0-ef13-456a-a1ff-d618f247b4c7", hint: "fashion model" },
  { src: "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Homepage2.png.jpg?alt=media&token=93103ea4-dfb7-4138-8427-5100004cf391", hint: "mens fashion" },
  { src: "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Homepage.3.jpg?alt=media&token=8a311781-b466-41bf-b57b-ef5fdf229d0e", hint: "stylish apparel" },
  { src: "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/HomePage.4.jpg?alt=media&token=439923c8-1f23-435c-aa34-3adcb5a3fc62", hint: "urban fashion" },
  { src: "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/HomePage5.png.jpg?alt=media&token=cb8c1725-4cc0-4c7d-9417-1d155023ac31", hint: "modern clothing" },
  { src: "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Homepage6.png.jpg?alt=media&token=d708f6bb-3105-4a8e-a3db-51d9c23119ad", hint: "fashion shoot" },
];

const ReelCard = ({ reel }: { reel: Reel }) => {
  return (
    <Card className="overflow-hidden relative group aspect-[9/16] border-2 border-transparent hover:border-primary transition-colors duration-300">
      <video
        src={reel.videoUrl}
        loop
        muted
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <CardFooter className="absolute bottom-0 left-0 right-0 p-4 bg-transparent">
        <Link href={`/products/${reel.productId}`} className="w-full">
            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg">
                <p className="font-semibold truncate">{reel.product!.name}</p>
                <p className="text-sm font-bold text-foreground">₹{reel.product!.price.toFixed(2)}</p>
            </div>
        </Link>
      </CardFooter>
    </Card>
  );
};


export default function HomePage() {
  const { products, getProductById } = useStore();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);

  const newArrivals = products.slice(0, 4);
  const oversizeTees = products.filter(p => p.category === "Oversized T-shirts");
  const premiumCollection = products.filter(p => p.price > 4000);

  const allCategories = [...new Set(products.map((p) => p.category))];

  useEffect(() => {
    const offersRef = ref(rtdb, 'offers');
    const unsubscribeOffers = onValue(offersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const offersData: Offer[] = Object.keys(data)
                .map(key => ({ id: key, ...data[key] }))
                .filter(offer => offer.isActive); // Only show active offers
            setOffers(offersData);
        }
    });

    const reelsRef = ref(rtdb, 'reels');
    const unsubscribeReels = onValue(reelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reelsData: Reel[] = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        const hydratedReels = reelsData.map(reel => ({
            ...reel,
            product: getProductById(reel.productId)
        })).filter(reel => reel.product); // Ensure product exists
        setReels(hydratedReels as (Reel & { product: Product })[]);
      }
    });

    return () => {
        unsubscribeOffers();
        unsubscribeReels();
    };
  }, [getProductById]);


  const categoryImages = useMemo(() => {
    const images: { [key: string]: { src: string; hint: string } } = {};
    allCategories.forEach((category) => {
      const productForCategory = products.find((p) => p.category === category);
      if (productForCategory && productForCategory.images.length > 0) {
        images[category] = {
          src: productForCategory.images[0],
          hint: productForCategory.dataAiHint,
        };
      } else {
        images[category] = {
          src: "https://placehold.co/600x400.png",
          hint: category.toLowerCase(),
        };
      }
    });
    return images;
  }, [allCategories, products]);


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
            }),
          ]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-[60vh]">
                  <Image
                    src={image.src}
                    alt={image.hint}
                    fill
                    className="object-cover"
                    data-ai-hint={image.hint}
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
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
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/products">Shop New Arrivals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Offers Marquee */}
      {offers.length > 0 && (
        <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
            <div className="marquee whitespace-nowrap">
                <div className="flex items-center text-sm font-semibold tracking-wider">
                {offers.map(offer => (
                    <React.Fragment key={offer.id}>
                        <Sparkles className="h-4 w-4 mx-2 flex-shrink-0" /> {offer.name} <span className="mx-4">|</span>
                    </React.Fragment>
                ))}
                 {offers.map(offer => (
                    <React.Fragment key={`${offer.id}-clone`}>
                        <Sparkles className="h-4 w-4 mx-2 flex-shrink-0" /> {offer.name} <span className="mx-4">|</span>
                    </React.Fragment>
                ))}
                </div>
            </div>
        </div>
      )}


      {/* Features Section */}
      <section className="bg-card w-full">
        <div className="py-16 md:py-20">
         <div className="container mx-auto">
            <div className="flex flex-row justify-around md:justify-center md:items-center md:gap-12 text-center">
                <div className="flex flex-col items-center gap-2 md:gap-4">
                <Archive className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                <div className="flex flex-col items-center">
                    <h3 className="text-base md:text-xl font-semibold font-headline mb-1 md:mb-2">
                    Exclusive Designs
                    </h3>
                    <p className="text-muted-foreground max-w-xs text-xs md:text-sm">
                    Curated pieces you won&apos;t find anywhere else.
                    </p>
                </div>
                </div>
                <div className="flex flex-col items-center gap-2 md:gap-4">
                <Shirt className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                <div className="flex flex-col items-center">
                    <h3 className="text-base md:text-xl font-semibold font-headline mb-1 md:mb-2">
                    Premium Quality
                    </h3>
                    <p className="text-muted-foreground max-w-xs text-xs md:text-sm">
                    Crafted from the finest materials for lasting comfort.
                    </p>
                </div>
                </div>
                <div className="flex flex-col items-center gap-2 md:gap-4">
                <Truck className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                <div className="flex flex-col items-center">
                    <h3 className="text-base md:text-xl font-semibold font-headline mb-1 md:mb-2">
                    Fast Shipping
                    </h3>
                    <p className="text-muted-foreground max-w-xs text-xs md:text-sm">
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
      
      {/* Watch and Shop Section */}
      {reels.length > 0 && (
        <section className="py-16 md:py-20 bg-card w-full">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">
                    Watch and Shop
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                    See our products in action. Click to shop the look.
                    </p>
                </div>
                <Carousel
                    opts={{
                    align: "start",
                    loop: reels.length > 3,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                    {reels.map((reel) => (
                        <CarouselItem
                        key={reel.id}
                        className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                        <div className="p-1">
                            <ReelCard reel={reel} />
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
                    <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80" />
                </Carousel>
            </div>
        </section>
      )}


      {/* Shop by Category Section */}
      <section className="py-16 md:py-20 bg-background w-full">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Explore our diverse range of apparel and accessories, categorized for your convenience.
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {allCategories.map((category) => (
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                key={category}
                className="group"
              >
                <Card className="overflow-hidden relative h-64">
                  <Image
                    src={categoryImages[category]?.src}
                    alt={category}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={categoryImages[category]?.hint}
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
