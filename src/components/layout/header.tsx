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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- Desktop Header --- */}
        <div className="hidden md:flex w-full items-center">
          <Link href="/" className="mr-8 flex items-center gap-2">
            <span className="inline-block text-xl font-bold uppercase tracking-wider bg-destructive text-destructive-foreground p-2 rounded-md">ACOOF</span>
          </Link>
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <div className="mx-2 h-6 border-l border-border"></div>
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="destructive">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>

        {/* --- Mobile Header --- */}
        <div className="flex w-full items-center justify-between md:hidden">
           <Link href="/" className="text-xl font-bold uppercase tracking-wider bg-destructive text-destructive-foreground p-2 rounded-md">
            ACOOF
          </Link>

          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="text-2xl font-bold font-headline">
                      ACOOF
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 p-4 text-lg">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="font-medium text-foreground hover:text-destructive"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild variant="destructive">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
