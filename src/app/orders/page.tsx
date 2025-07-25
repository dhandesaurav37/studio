
"use client";

import { useState, useEffect } from "react";
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
import { useStore, UserOrder } from "@/hooks/use-store";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, XCircle, Undo2, Loader2 } from "lucide-react";
import type { OrderStatus } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { differenceInDays, parseISO } from 'date-fns';

export default function OrdersPage() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const { orders, getProductById, updateOrderStatus, addToCart } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

  const handleToggle = (orderId: string) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };
  
  const handleOrderAction = async (orderId: string, status: OrderStatus, actionType: 'cancel' | 'return') => {
      setIsLoading(prev => ({...prev, [orderId]: true}));
      try {
        await updateOrderStatus(orderId, status);

        let userToast: any;

        if (actionType === 'cancel') {
            userToast = {
                title: "Order Cancelled",
                description: "Your order has been successfully cancelled.",
            };
        } else { // return
            userToast = {
                title: "Return Requested",
                description: "Your return request has been submitted.",
            };
        }
        
        toast(userToast);

      } catch (error) {
          toast({
              title: "Error",
              description: "There was a problem updating your order. Please try again.",
              variant: "destructive",
          });
      } finally {
          setIsLoading(prev => ({...prev, [orderId]: false}));
      }
  }

  const handleReorder = (order: UserOrder) => {
    order.items.forEach(item => {
      const product = getProductById(item.productId);
      if (product) {
        addToCart({ product, quantity: item.quantity, size: item.size });
      }
    });
    toast({
      title: "Items Added to Cart",
      description: "The items from your previous order have been added to your cart.",
    });
    router.push('/cart');
  };

  const getBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "Delivered":
      case 'Order Returned Successfully':
        return "default";
      case "Shipped":
      case 'Return Request Accepted':
        return "secondary";
      case "Cancelled":
      case 'Return Rejected':
        return "destructive";
      case 'Return Requested':
      case "Pending":
      default:
        return "outline";
    }
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
          {hydratedOrders.map((order) => {
            const isReturnable = order.status === 'Delivered' && order.deliveryDate && differenceInDays(new Date(), parseISO(order.deliveryDate)) <= 7;
            const isActionLoading = isLoading[order.id];
            return (
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
                        Order #{order.id.slice(-6).toUpperCase()}
                      </CardTitle>
                      <CardDescription>Date: {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={getBadgeVariant(order.status)}
                        className="self-start sm:self-center w-48 justify-center text-center"
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
                            key={`${item.product!.id}-${item.size}`}
                            className="flex items-start gap-4"
                          >
                            <Link href={`/products/${item.product!.id}`} className="flex-shrink-0">
                                <div className="relative h-20 w-20 rounded-md overflow-hidden">
                                <Image
                                    src={item.product!.images[0]}
                                    alt={item.product!.name}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={item.product!.dataAiHint}
                                />
                                </div>
                            </Link>
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
                            <span className="text-muted-foreground">Delivered On:</span> {new Date(order.deliveryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}
                          </p>
                         </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between flex-wrap gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleReorder(order)}>Reorder</Button>
                       <div className="flex gap-2">
                        {order.status === 'Pending' && (
                            <Button variant="destructive" size="sm" onClick={() => handleOrderAction(order.id, 'Cancelled', 'cancel')} disabled={isActionLoading}>
                                {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <XCircle className="mr-2 h-4 w-4"/>}
                                Cancel Order
                            </Button>
                        )}
                         {isReturnable && (
                            <Button variant="outline" size="sm" onClick={() => handleOrderAction(order.id, 'Return Requested', 'return')} disabled={isActionLoading}>
                                {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Undo2 className="mr-2 h-4 w-4"/>}
                                Return Order
                            </Button>
                        )}
                       </div>
                    </CardFooter>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )
          })}
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
