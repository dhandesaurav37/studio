"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  ChevronDown,
  Search,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import Image from "next/image";

const navLinks = [
  { name: "MEN", href: "/products?category=men" },
  { name: "WOMEN", href: "/products?category=women" },
  { name: "SNEAKERS", href: "/products?category=sneakers" },
];

export function AppHeader() {
  const [isClient, setIsClient] = useState(false);
  const [activeLink, setActiveLink] = useState("MEN");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderDesktopHeader = () => (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 p-4">
                 <Link href="/login" className="text-lg font-medium hover:text-primary/80">Login / Register</Link>
                 <hr/>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary/80"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/souled-store-logo.svg" alt="The Souled Store" width={40} height={40} />
            <span className="font-bold text-xl font-headline sr-only">
              The Souled Store
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:flex items-center gap-1">
            <MapPin className="h-5 w-5" />
            <span>India</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="hidden md:flex">Log In/Register</Button>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon">
              <Search className="h-6 w-6" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-6 w-6" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-6 w-6" />
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-teal-100 text-teal-800">
        <div className="container mx-auto flex items-center justify-center gap-4 h-10 text-sm font-medium">
          <span>Earn 10% Cashback on Every App Order</span>
          <div className="flex items-center gap-2">
            <Image src="https://placehold.co/24x24.png" alt="Google Play" width={20} height={20} data-ai-hint="google play" />
            <Image src="https://placehold.co/24x24.png" alt="App Store" width={20} height={20} data-ai-hint="apple store" />
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="hidden md:flex container mx-auto h-12 items-center justify-center gap-12">
        {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setActiveLink(link.name)}
              className={`text-base font-semibold tracking-wider relative h-full flex items-center ${
                activeLink === link.name
                  ? "text-primary"
                  : "text-muted-foreground"
              } hover:text-primary transition-colors`}
            >
              {link.name}
              {activeLink === link.name && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-teal-400"></span>
              )}
            </Link>
          ))}
      </div>
    </header>
  );

  const renderServerFallback = () => (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <div className="h-6 w-6 md:hidden"></div>
        <div className="h-10 w-24"></div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10"></div>
          <div className="h-10 w-10"></div>
          <div className="h-10 w-10"></div>
        </div>
      </div>
    </header>
  );

  return isClient ? renderDesktopHeader() : renderServerFallback();
}
