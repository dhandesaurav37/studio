
"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Menu, User as UserIcon, LayoutDashboard, Package, Truck } from "lucide-react";
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
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { name: "Shop", href: "/products" },
  { name: "Premium Products", href: "/products" },
];

const ADMIN_EMAIL = "dhandesaurav37@gmail.com";

export function AppHeader() {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Success",
        description: "You have been logged out.",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isMounted) {
    return (
       <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="w-full flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
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
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hi, {user.displayName || 'User'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <>
                <DropdownMenuItem asChild><Link href="/admin/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/admin/orders"><Truck className="mr-2 h-4 w-4" />Manage Orders</Link></DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/orders">Orders</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/wishlist">Wishlist</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/notifications">Notifications</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
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
     if (user) {
      return (
         <>
          <hr className="my-4" />
          {isAdmin && (
            <>
              <Link href="/admin/dashboard" className="font-medium text-foreground hover:text-destructive">Dashboard</Link>
              <Link href="/admin/orders" className="font-medium text-foreground hover:text-destructive">Manage Orders</Link>
            </>
          )}
          <Link href="/profile" className="font-medium text-foreground hover:text-destructive">Profile</Link>
          <Link href="/orders" className="font-medium text-foreground hover:text-destructive">Orders</Link>
          <Link href="/wishlist" className="font-medium text-foreground hover:text-destructive">Wishlist</Link>
          <Link href="/notifications" className="font-medium text-foreground hover:text-destructive">Notifications</Link>
          <Link href="/settings" className="font-medium text-foreground hover:text-destructive">Settings</Link>
          <hr className="my-4" />
          <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
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
      <div className="w-full flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
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
