"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { products } from "@/lib/data";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const cartItems = [
  { product: products[0], quantity: 1, size: "M" },
  { product: products[2], quantity: 1, size: "L" },
];
const subtotal = cartItems.reduce(
  (acc, item) => acc + item.product.price * item.quantity,
  0
);
const shipping = 5.0;
const total = subtotal + shipping;

export default function CartPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        Your Cart
      </h1>
      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {cartItems.map((item) => (
                    <li
                      key={item.product.id}
                      className="flex items-center p-4 sm:p-6 gap-4"
                    >
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-md overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint={item.product.dataAiHint}
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-semibold hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size}
                        </p>
                        <p className="font-bold sm:hidden mt-2">
                          ${item.product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center border rounded-md mt-2 w-fit">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="font-bold text-lg">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
