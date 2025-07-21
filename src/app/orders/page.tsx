
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useStore } from "@/hooks/use-store";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function OrdersPage() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const { orders, getProductById } = useStore();

  const handleToggle = (orderId: string) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };

  const hydratedOrders = orders.map(order => ({
    ...order,
    items: order.items.map(item => {
        const product = getProductById(item.productId);
        return {
            ...item,
            product
        }
    }).filter(item => item.product) // Filter out items where product is not found
  }));


  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        My Orders
      </h1>
      {hydratedOrders.length > 0 ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {hydratedOrders.map((order) => (
            <Collapsible
              key={order.id}
              asChild
              open={openOrderId === order.id}
              onOpenChange={() => handleToggle(order.id)}
            >
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="font-headline">
                      Order #{order.id}
                    </CardTitle>
                    <CardDescription>Date: {order.date}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Cancelled"
                          ? "destructive"
                          : order.status === "Pending"
                          ? "outline"
                          : "secondary"
                      }
                      className="self-start sm:self-center"
                    >
                      {order.status}
                    </Badge>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline">
                        View Details
                        {openOrderId === order.id ? (
                          <ChevronUp className="h-4 w-4 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">
                    Total: ₹{order.total.toFixed(2)}
                  </p>
                </CardContent>
                <CollapsibleContent>
                  <CardContent>
                    <Separator className="my-4" />
                    <h4 className="font-semibold mb-4">Order Items</h4>
                    <ul className="space-y-4">
                      {order.items.map((item) => (
                        <li
                          key={item.product!.id}
                          className="flex items-start gap-4"
                        >
                          <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product!.images[0]}
                              alt={item.product!.name}
                              fill
                              className="object-cover"
                              data-ai-hint={item.product!.dataAiHint}
                            />
                          </div>
                          <div className="flex-1">
                            <Link
                              href={`/products/${item.product!.id}`}
                              className="font-semibold hover:underline"
                            >
                              {item.product!.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                            <p className="font-semibold mt-1">
                              ₹{item.product!.price.toFixed(2)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {order.deliveryDate && (
                       <div className="mt-6">
                        <Separator className="my-4"/>
                        <h4 className="font-semibold mb-2">Delivery Information</h4>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Estimated Delivery:</span> {order.deliveryDate}
                        </p>
                       </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" size="sm">Reorder</Button>
                  </CardFooter>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold">No orders yet</h2>
          <p className="text-muted-foreground mt-2">
            You haven't placed any orders with us.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
