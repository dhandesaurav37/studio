"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
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
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-20 items-center">
        {/* Left Section: Nav Links */}
        <div className="flex items-center gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary/80"
                  >
                    {link.name}
                  </Link>
                ))}
                 <hr/>
                <Link href="/login" className="text-lg font-medium hover:text-primary/80">Login</Link>
                <Link href="/signup" className="text-lg font-medium hover:text-primary/80">Sign Up</Link>
              </nav>
            </SheetContent>
          </Sheet>
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setActiveLink(link.name)}
                className={`text-sm font-semibold tracking-wider relative ${
                  activeLink === link.name
                    ? "text-primary"
                    : "text-muted-foreground"
                } hover:text-primary`}
              >
                {link.name}
                {activeLink === link.name && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-500"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Section: Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              className="h-10 w-auto"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C58.3,90 66,87.4 72.4,83.1 C72.8,82.8 73,82.3 72.8,81.8 C72.6,81.3 72.1,81 71.6,81.1 C65.9,82.9 59.7,84 53,84 C33.1,84 16,66.9 16,47 C16,27.1 33.1,10 53,10 C69.9,10 84,24.1 84,41 C84,47.6 81.7,53.6 77.9,58.3 C77.5,58.8 77.6,59.5 78.1,59.8 L81.5,62.1 C82,62.4 82.6,62.2 82.9,61.7 C87.4,55.9 90,48.7 90,41 C90,24.3 73.7,10 55,10"
                fill="black"
              />
              <path d="M45,45 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0" fill="black" />
              <path d="M65,45 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0" fill="black" />
            </svg>
            <span className="font-bold text-xl font-headline sr-only">
              The Souled Store
            </span>
          </Link>
        </div>

        {/* Right Section: Search and Icons */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Input
              type="search"
              placeholder="What are you looking for?"
              className="pl-10 pr-4 py-2 rounded-full bg-secondary w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button variant="ghost" size="icon">
            <MapPin className="h-6 w-6" />
            <span className="sr-only">Location</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6" />
            <span className="sr-only">Profile</span>
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
    </header>
  );

  const renderServerFallback = () => (
     <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <div className="h-6 w-6"></div>
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
