"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Menu, User } from "lucide-react";
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
  { name: "About", href: "/about" },
];

export function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
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
      <div className="flex h-20 items-center justify-between">
        <div className="container flex items-center gap-6">
          {/* Mobile Menu and Logo */}
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
                 <div className="border-t pt-4">
                  <Button asChild className="w-full">
                    <Link href="/login">Login / Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-2xl font-bold font-headline">
            White Wolf
          </Link>
          {/* Desktop Navigation */}
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

        {/* Action Icons */}
        <div className="flex items-center justify-end gap-2 pr-4 sm:pr-6 lg:pr-8">
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
          <div className="hidden md:flex">
             <Button asChild variant="outline">
              <Link href="/login">Login / Sign Up</Link>
            </Button>
          </div>
           <Button variant="ghost" size="icon" asChild className="md:hidden">
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}