
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Shop", href: "/products" },
  { name: "Premium Products", href: "/products" },
];

export function AppHeader() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state

  useEffect(() => {
    setIsMounted(true);
    // In a real app, you'd check for a token or session here
    // For now, we'll just simulate a logged-in user after a delay
    const timer = setTimeout(() => setIsLoggedIn(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
       <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between">
            <div className="w-1/3"></div>
            <div className="w-1/3 flex justify-center">
                 <Link href="/" className="mr-8 flex items-center gap-2">
                    <span className="text-2xl font-bold font-headline tracking-wider">
                    White Wolf
                    </span>
                </Link>
            </div>
            <div className="w-1/3"></div>
        </div>
      </header>
    );
  }

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/orders">Orders</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/wishlist">Wishlist</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/notifications">Notifications</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </>
    );
  };
  
  const renderMobileAuthButtons = () => {
     if (isLoggedIn) {
      return (
         <>
          <hr className="my-4" />
          <Link href="/orders" className="font-medium text-foreground hover:text-destructive">Orders</Link>
          <Link href="/wishlist" className="font-medium text-foreground hover:text-destructive">Wishlist</Link>
          <Link href="/notifications" className="font-medium text-foreground hover:text-destructive">Notifications</Link>
          <hr className="my-4" />
          <Button variant="ghost" onClick={() => setIsLoggedIn(false)}>Log Out</Button>
        </>
      )
     }
     return (
        <>
            <hr className="my-4" />
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
        </>
     )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        {/* --- Desktop Header --- */}
        <div className="hidden md:flex w-full items-center">
          <Link href="/" className="mr-8 flex items-center gap-2">
            <span className="text-2xl font-bold font-headline tracking-wider">
              White Wolf
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 ml-auto">
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
            <div className="mx-2 h-6 border-l border-border"></div>
            {renderAuthButtons()}
          </div>
        </div>

        {/* --- Mobile Header --- */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/" className="text-xl font-bold font-headline">
            White Wolf
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
                      White Wolf
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
                  {renderMobileAuthButtons()}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
