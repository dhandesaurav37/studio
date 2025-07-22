import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

export function Footer() {
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
                  <Link
                    href="/#our-story"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:thewhitewolf0501@gmail.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    thewhitewolf0501@gmail.com
                  </a>
                </li>
                 <li>
                  <a
                    href="tel:+917219789870"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +91 7219789870
                  </a>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQs
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
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Size Guide
                  </Link>
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
