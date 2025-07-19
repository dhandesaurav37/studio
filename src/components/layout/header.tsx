
"use client";

import Link from "next/link";
import { Heart, ShoppingBag, User, Menu, X, Bell, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="container flex h-16 items-center justify-between">
        {/* Left Side: Mobile Menu Trigger and Desktop Nav */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-bold text-xl font-headline">
                      The White Wolf
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="p-4 flex-grow">
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                     <Link
                        href="/#new-arrivals"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        New Arrivals
                      </Link>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop: Brand Name & Nav */}
          <div className="hidden md:flex items-center gap-6">
             <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl font-headline">The White Wolf</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium p-0 h-auto">
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
            </nav>
          </div>
        </div>

        {/* Mobile: Centered Brand Name (Only shown when menu is closed) */}
         <div className="flex-1 flex justify-center md:hidden">
             <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl font-headline">The White Wolf</span>
            </Link>
        </div>
        
        {/* Right Side: Action Icons */}
        <div className="flex items-center space-x-1 md:space-x-2">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/orders"><Package className="mr-2 h-4 w-4" />Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/notifications"><Bell className="mr-2 h-4 w-4" />Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                <Link href="/login"><LogOut className="mr-2 h-4 w-4" />Login</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
