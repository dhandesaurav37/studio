import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand and Socials */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <h3 className="text-2xl font-headline font-bold mb-4">
              The White Wolf
            </h3>
            <p className="text-primary-foreground/70 mb-6 max-w-xs leading-relaxed">
              Timeless style, uncompromising quality, and conscious
              craftsmanship for the modern individual.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="#"
                aria-label="Instagram"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                aria-label="Youtube"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Youtube className="h-6 w-6" />
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
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#new-arrivals"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=t-shirts"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    T-Shirts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=jeans"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
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
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
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
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
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
            <p className="text-sm text-primary-foreground/70 mb-4">
              Subscribe for exclusive updates, new arrivals, and special offers.
            </p>
            <form className="flex w-full items-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-r-none h-11 flex-1"
                aria-label="Email for newsletter"
              />
              <Button type="submit" variant="secondary" className="rounded-l-none h-11">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} The White Wolf Co. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
