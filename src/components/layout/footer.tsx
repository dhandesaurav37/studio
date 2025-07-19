import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-headline font-semibold mb-4">
              WHITE WOLF
            </h3>
            <p className="text-sm text-primary-foreground/80">
              Premium clothing for the modern man.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=t-shirts"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=shirts"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=jeans"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Jeans
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#our-story"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <p className="text-sm text-primary-foreground/80 mb-3">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="email"
                placeholder="Email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                aria-label="Email for newsletter"
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} White Wolf. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
