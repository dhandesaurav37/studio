
"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Menu, User as UserIcon, LayoutDashboard, Truck, Undo2, Megaphone, Video } from "lucide-react";
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
import { useStore } from "@/hooks/use-store";
import { Badge } from "../ui/badge";
import Image from "next/image";

const navLinks = [
  { name: "Shop", href: "/products" },
  { name: "Premium Products", href: "/premium-products" },
];

const ADMIN_EMAIL = "dhandesaurav37@gmail.com";
const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/WhiteWolfLogo.png?alt=media&token=8b8f27e6-15ac-4c62-90e7-835455a376a3";

export function AppHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { cart, wishlist } = useStore();

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

  const renderAuthButtons = () => {
    if (!isMounted) return <div className="w-24 h-10" />; 
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
                <DropdownMenuItem asChild><Link href="/admin/return-orders"><Undo2 className="mr-2 h-4 w-4" />Return Orders</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/admin/ads-and-offers"><Megaphone className="mr-2 h-4 w-4" />Advertise & Offers</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/admin/reels"><Video className="mr-2 h-4 w-4" />Manage Reels</Link></DropdownMenuItem>

              </>
            )}
            <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/orders">Orders</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/wishlist">Wishlist</Link></DropdownMenuItem>
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
              <Link href="/admin/dashboard" className="block py-2 font-medium text-foreground hover:text-destructive">Dashboard</Link>
              <Link href="/admin/orders" className="block py-2 font-medium text-foreground hover:text-destructive">Manage Orders</Link>
              <Link href="/admin/return-orders" className="block py-2 font-medium text-foreground hover:text-destructive">Return Orders</Link>
              <Link href="/admin/ads-and-offers" className="block py-2 font-medium text-foreground hover:text-destructive">Advertise & Offers</Link>
              <Link href="/admin/reels" className="block py-2 font-medium text-foreground hover:text-destructive">Manage Reels</Link>
            </>
          )}
          <Link href="/profile" className="block py-2 font-medium text-foreground hover:text-destructive">Profile</Link>
          <Link href="/orders" className="block py-2 font-medium text-foreground hover:text-destructive">Orders</Link>
          <Link href="/wishlist" className="block py-2 font-medium text-foreground hover:text-destructive">Wishlist</Link>
          <Link href="/settings" className="block py-2 font-medium text-foreground hover:text-destructive">Settings</Link>
          <hr className="my-4" />
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start px-0">Log Out</Button>
        </>
      )
     }
     return (
        <div className="mt-6 flex flex-col gap-2">
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
     )
  }

  const HeaderIcon = ({ href, children, count }: { href: string, children: React.ReactNode, count: number }) => (
    <Button variant="ghost" size="icon" asChild>
      <Link href={href} className="relative">
        {children}
        {isMounted && count > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-2 h-5 w-5 rounded-full flex items-center justify-center p-0 text-xs"
          >
            {count}
          </Badge>
        )}
      </Link>
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="w-full flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- Desktop Header --- */}
        <div className="hidden md:flex w-full items-center">
          <Link href="/" className="mr-8 flex items-center gap-2">
            <Image src={LOGO_URL} alt="White Wolf Logo" width={48} height={48} />
            <span className="text-2xl font-bold font-headline tracking-wider text-foreground">
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
            <HeaderIcon href="/wishlist" count={wishlist.length}>
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </HeaderIcon>
            <HeaderIcon href="/cart" count={cart.length}>
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </HeaderIcon>
            <div className="mx-2 h-6 border-l border-border"></div>
            {renderAuthButtons()}
          </div>
        </div>

        {/* --- Mobile Header --- */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline">
             <Image src={LOGO_URL} alt="White Wolf Logo" width={40} height={40} />
            <span className="text-foreground">White Wolf</span>
          </Link>

          <div className="flex items-center">
            <HeaderIcon href="/cart" count={cart.length}>
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </HeaderIcon>
            {isMounted && (
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
                      <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline">
                         <Image src={LOGO_URL} alt="White Wolf Logo" width={40} height={40} />
                        <span className="text-foreground">White Wolf</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <nav className="flex flex-col gap-4 text-lg">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="font-medium text-foreground hover:text-destructive"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>
                    {renderMobileAuthButtons()}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
