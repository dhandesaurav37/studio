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
  { name: "New Arrivals", href: "/products?sort=newest" },
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

  if (!isMounted) {
    return (
      <header className={headerClasses}>
        <div className="container flex h-20 items-center justify-between">
          <div className="text-2xl font-bold font-headline">White Wolf</div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10" />
            <div className="h-10 w-10" />
            <div className="h-11 w-24" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-20 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between">
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
            <div className="flex items-center gap-6">
              <Link href="/" className="text-2xl font-bold font-headline">
                White Wolf
              </Link>
              <nav className="hidden md:flex items-center gap-6">
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
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
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
      </div>
    </header>
  );
}
