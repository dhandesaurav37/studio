
"use client";

import Link from "next/link";
import { Heart, Search, ShoppingBag, User, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";

const navLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=t-shirts", label: "T-Shirts" },
  { href: "/products?category=shirts", label: "Shirts" },
  { href: "/products?category=jeans", label: "Jeans" },
];

export function AppHeader() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile: Brand Name on Left */}
        <div className="flex md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl font-headline">WHITE WOLF</span>
          </Link>
        </div>

        {/* Desktop: Brand and Nav on Left */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl font-headline">WHITE WOLF</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Shop
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/#new-arrivals"
              className="transition-colors hover:text-foreground/80"
            >
              New Arrivals
            </Link>
            <Link
              href="/#our-story"
              className="transition-colors hover:text-foreground/80"
            >
              Our Story
            </Link>
          </nav>
        </div>

        {/* Desktop: Search and Actions on Right */}
        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
          <div className="w-full flex-1 md:w-auto md:flex-none max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </nav>
        </div>

        {/* Mobile: Menu on Right */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-bold text-xl font-headline">
                      WHITE WOLF
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-4 flex-grow">
                   <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-9"
                    />
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="p-4 border-t flex items-center justify-around">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="h-6 w-6" />
                      <span className="sr-only">Wishlist</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                      <ShoppingBag className="h-6 w-6" />
                      <span className="sr-only">Cart</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/notifications" onClick={() => setMobileMenuOpen(false)}>
                      <Bell className="h-6 w-6" />
                      <span className="sr-only">Notifications</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-6 w-6" />
                      <span className="sr-only">Account</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
