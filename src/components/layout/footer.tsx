
"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Mail, Phone, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStore } from "@/hooks/use-store";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export function Footer() {
  const { averageRating } = useStore();

  return (
    <footer className="bg-card text-card-foreground border-t w-full">
      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand and Socials */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl font-headline font-bold">
                White Wolf
              </h3>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Timeless style, uncompromising quality, and conscious
              craftsmanship for the modern individual.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="#"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4 tracking-wider uppercase text-sm">Shop</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/products"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#new-arrivals"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=t-shirts"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    T-Shirts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=jeans"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Jeans
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 tracking-wider uppercase text-sm">About</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors text-left">Our Story</button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                       <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">The White Wolf: A Story of Strength, Style, and Self-Respect</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-96 w-full pr-6">
                        <div className="prose prose-sm dark:prose-invert text-muted-foreground space-y-4">
                            <p>In 2020, in the heart of a world that was changing rapidly—where self-expression was beginning to roar louder than ever before—The White Wolf was born. Not just as a clothing brand, but as a bold statement. A symbol of strength, purpose, and individuality for the modern man. We didn't just want to create clothes. We wanted to challenge the way society saw men—and the way men saw themselves.</p>
                            <p className="font-semibold text-foreground">The name "The White Wolf" isn't just a name—it’s a philosophy.</p>
                            <p>The white wolf is rare. It walks alone, yet it never loses its way. It leads not through dominance, but through quiet confidence. It survives harsh winters, adapts, evolves, and emerges stronger each time. That’s what we see in today’s youth—especially young men who are often caught in the crossfire of outdated expectations and new-age realities.</p>
                             <p className="font-semibold text-foreground">We created this brand because we believe that men deserve more.</p>
                            <ul className="list-disc pl-5">
                                <li>More than being boxed into stereotypes.</li>
                                <li>More than being told to “man up” in silence.</li>
                                <li>More than being seen just for their toughness, instead of their sensitivity, creativity, and style.</li>
                                <li>More than fast fashion that fades fast and says nothing.</li>
                            </ul>
                            <p>At The White Wolf, we stand for the modern man—one who is fierce, fashionable, and unapologetically himself.</p>

                             <h3 className="font-headline text-lg text-foreground pt-4">Why We Exist</h3>
                            <p>Men's fashion has long been underwhelming. For too long, the racks have been filled with the same cuts, the same colors, the same lifeless designs that say nothing about who the wearer is. We thought: why shouldn’t men wear clothes that reflect their journey? Their fight? Their ambition? Their individuality?</p>
                            <p>Our mission is simple: to redefine how men express themselves through clothing.</p>

                             <h3 className="font-headline text-lg text-foreground pt-4">Who We’re For</h3>
                            <p>The White Wolf is for every man who walks his own path. Whether you're grinding through your early 20s, building your dream in silence, or figuring out your voice in a noisy world—this brand is for you.</p>

                             <h3 className="font-headline text-lg text-foreground pt-4">What We Believe Men Deserve</h3>
                            <p>We believe men deserve clothing that respects them—not just their bodies, but their stories. We believe men deserve to:</p>
                            <ul className="list-disc pl-5">
                                <li>Be stylish without losing masculinity or authenticity</li>
                                <li>Wear designs that resonate, not just “look cool”</li>
                                <li>Dress with freedom and identity, not conformity</li>
                                <li>Be seen as multi-dimensional human beings—strong and sensitive, focused and free, fierce and kind</li>
                            </ul>

                            <h3 className="font-headline text-lg text-foreground pt-4">Our Style DNA</h3>
                            <p>Minimal. Sharp. Versatile. Confident. We don’t believe in overdoing it. We believe in smart design, premium materials, and wearable silhouettes. Our drops are curated—not cluttered. We design pieces that fit into your life, not the other way around.</p>

                             <h3 className="font-headline text-lg text-foreground pt-4">The Pack Mentality</h3>
                            <p>Even though the white wolf walks alone, it never forgets its pack. We built this brand with community at the center. Every drop, every campaign, every collab—we listen to you. We’re shaped by your feedback, your spirit, your hustle.</p>
                            
                             <h3 className="font-headline text-lg text-foreground pt-4">From 2020 to the Future</h3>
                            <p>What started in 2020 as a small idea is now a movement. From our first hoodie drop to our latest summer capsule, every collection reminds us that we’re not just making clothes—we’re making statements.</p>
                           
                            <p className="font-semibold text-foreground pt-4">The White Wolf Isn’t Just a Brand—It’s Who You Are</p>
                            <p>When you wear The White Wolf, you’re not just wearing fashion. You’re wearing a belief: That men can be more. Do more. Deserve more.</p>

                            <p className="font-bold text-foreground text-center pt-4">Join the Pack. Walk Your Path. Be the White Wolf.</p>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors text-left">Contact Us</button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-headline">Contact Information</DialogTitle>
                        <DialogDescription>
                          Get in touch with us through the channels below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                          <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <a href="mailto:thewhitewolf0501@gmail.com" className="hover:underline">
                            thewhitewolf0501@gmail.com
                          </a>
                        </div>
                        <div className="flex items-center gap-4">
                          <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <a href="tel:+917219789870" className="hover:underline">
                            +91 7219789870
                          </a>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    FAQs
                    <span className="flex items-center text-xs text-amber-500">
                      <Star className="h-3 w-3 mr-1 fill-amber-500" />
                      {averageRating.toFixed(1)}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold mb-4 tracking-wider uppercase text-sm">Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors text-left">Size Guide</button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="font-headline">Size Guide</DialogTitle>
                        <DialogDescription>
                          Find your perfect fit with our sizing chart. All measurements are in inches and centimeters.
                        </DialogDescription>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-bold">Size</TableHead>
                            <TableHead>Chest (inches)</TableHead>
                            <TableHead>Chest (cm)</TableHead>
                            <TableHead>Recommended for</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-bold">S</TableCell>
                            <TableCell>36 – 38 in</TableCell>
                            <TableCell>91 – 96 cm</TableCell>
                            <TableCell>Slim / lean build</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-bold">M</TableCell>
                            <TableCell>38 – 40 in</TableCell>
                            <TableCell>96 – 101 cm</TableCell>
                            <TableCell>Average build</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-bold">L</TableCell>
                            <TableCell>40 – 42 in</TableCell>
                            <TableCell>101 – 106 cm</TableCell>
                            <TableCell>Broad shoulders / athletic build</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-bold">XL</TableCell>
                            <TableCell>42 – 44 in</TableCell>
                            <TableCell>106 – 112 cm</TableCell>
                            <TableCell>Heavier / muscular build</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold mb-4 tracking-wider uppercase text-sm">
              Join The Pack
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe for exclusive updates, new arrivals, and special offers.
            </p>
            <form className="flex w-full max-w-sm items-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background border-border rounded-r-none h-11 flex-1"
                aria-label="Email for newsletter"
              />
              <Button type="submit" variant="secondary" className="rounded-l-none h-11">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} White Wolf Co. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
