
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
import { useStore } from "@/hooks/use-store";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateCartItemQuantity, calculateDiscountedPrice } = useStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  
  const discount = cart.reduce(
    (acc, item) => acc + (item.product.price - calculateDiscountedPrice(item.product)) * item.quantity,
    0
  );

  const discountedSubtotal = subtotal - discount;
  const shipping = cart.length > 0 ? 150 : 0;
  const total = discountedSubtotal + shipping;

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        Your Cart
      </h1>
      {cart.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {cart.map((item) => {
                    const discountedPrice = calculateDiscountedPrice(item.product);
                    const hasOffer = discountedPrice < item.product.price;
                    return (
                      <li
                        key={`${item.product.id}-${item.size}`}
                        className="flex items-center p-4 sm:p-6 gap-4 sm:gap-6 relative"
                      >
                        <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
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
                          <div className="font-bold sm:hidden mt-2 flex items-baseline gap-2">
                             {hasOffer && (
                                <p className="text-destructive">₹{discountedPrice.toFixed(2)}</p>
                              )}
                              <p className={hasOffer ? 'text-muted-foreground line-through text-sm' : ''}>
                                ₹{item.product.price.toFixed(2)}
                              </p>
                          </div>
                          <div className="flex items-center border rounded-md mt-2 w-fit">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-end gap-2">
                          <div className="font-bold text-lg flex items-baseline gap-2">
                             {hasOffer && (
                                <p className="text-destructive">₹{(discountedPrice * item.quantity).toFixed(2)}</p>
                              )}
                              <p className={hasOffer ? 'text-muted-foreground line-through text-sm' : ''}>
                                ₹{(item.product.price * item.quantity).toFixed(2)}
                              </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="sm:hidden text-muted-foreground hover:text-destructive absolute top-2 right-2"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                      </li>
                    )
                  })}
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
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Discount</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
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
