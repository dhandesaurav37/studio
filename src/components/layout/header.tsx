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
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
];

export function AppHeader() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-card text-card-foreground border-b border-border">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- Desktop Header --- */}
        <div className="hidden md:flex items-center gap-8 w-full">
          {/* Left Side */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold font-headline">
              White Wolf
            </Link>
            <nav className="flex items-center gap-6">
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

          {/* Right Side */}
          <div className="flex items-center gap-6 ml-auto">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>

        {/* --- Mobile Header --- */}
        <div className="flex items-center justify-between w-full md:hidden">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                   <Link href="/" className="text-2xl font-bold font-headline">
                      White Wolf
                    </Link>
                </SheetTitle>
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
                 <hr className="my-4"/>
                 <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          
          {/* Mobile Logo */}
          <Link href="/" className="text-2xl font-bold font-headline">
              White Wolf
          </Link>

          {/* Mobile Actions */}
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
          </div>
        </div>
      </div>
    </header>
  );
}
