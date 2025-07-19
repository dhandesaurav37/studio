"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Shop", href: "/products" },
  { name: "Premium Products", href: "/products?category=Jackets" },
];

export function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = `sticky top-0 z-50 w-full transition-all duration-300 ${
    isScrolled
      ? "bg-background/80 backdrop-blur-sm border-b"
      : "bg-transparent"
  }`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 p-4 text-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-medium text-foreground hover:text-primary/80"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-2xl font-bold font-headline">
            White Wolf
          </Link>
        </div>

        {isMounted ? (
          <div className="flex items-center justify-end gap-2">
            <nav className="hidden md:flex items-center gap-6 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login / Sign Up</Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            {/* Placeholder for nav links */}
            <div className="hidden md:flex items-center gap-6 mr-4">
               <div className="h-5 w-12 bg-muted rounded-md" />
               <div className="h-5 w-28 bg-muted rounded-md" />
            </div>
            {/* Placeholders for action buttons */}
            <div className="h-10 w-10 bg-muted rounded-full" />
            <div className="h-10 w-10 bg-muted rounded-full" />
            <div className="h-11 w-28 bg-muted rounded-md" />
          </div>
        )}
      </div>
    </header>
  );
}
