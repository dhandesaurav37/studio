
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Search, CheckCircle, XCircle, PackageCheck, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore, OrderStatus } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import type { AdminOrder } from "@/lib/admin-data";
import { rtdb } from "@/lib/firebase";
import { onValue, ref, update } from "firebase/database";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminReturnOrdersPage() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
  const { updateOrderStatus: updateStoreOrderStatus, addNotification, getProductById } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    const ordersRef = ref(rtdb, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const ordersData: AdminOrder[] = Object.keys(data).map(key => ({
                ...data[key],
                id: key,
            }));
            setAllOrders(ordersData);
        } else {
            setAllOrders([]);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const returnOrders = useMemo(() => allOrders
    .map(order => ({
        ...order,
        items: order.items.map(item => ({...item, product: getProductById(item.productId)}))
    }))
    .filter(o => 
        o.items.every(i => i.product) && 
        ['Return Requested', 'Return Request Accepted', 'Order Returned Successfully', 'Return Rejected'].includes(o.status)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [allOrders, getProductById]);

  const handleToggle = (orderId: string) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };
  
  const handleReturnAction = async (orderId: string, action: "accept-request" | "reject-request" | "confirm-collection") => {
    let newStatus: OrderStatus | null = null;
    let toastTitle = "";
    let userNotificationTitle = "";
    let userNotificationDescription = "";
    let userNotificationIcon = "";

    if (action === "accept-request") {
        newStatus = 'Return Request Accepted';
        toastTitle = 'Return Request Accepted';
        userNotificationTitle = 'Return Request Accepted';
        userNotificationDescription = `Your return request for order #${orderId.slice(-6).toUpperCase()} has been accepted. A pickup will be scheduled soon.`;
        userNotificationIcon = 'CheckCircle';
    } else if (action === "reject-request") {
        newStatus = 'Return Rejected';
        toastTitle = 'Return Request Rejected';
        userNotificationTitle = 'Return Request Rejected';
        userNotificationDescription = `Your return request for order #${orderId.slice(-6).toUpperCase()} has been rejected.`;
        userNotificationIcon = 'XCircle';
    } else if (action === "confirm-collection") {
        newStatus = 'Order Returned Successfully';
        toastTitle = 'Return Collected';
        userNotificationTitle = 'Return Completed';
        userNotificationDescription = `The returned item(s) for order #${orderId.slice(-6).toUpperCase()} have been collected and your return is complete.`;
        userNotificationIcon = 'PackageCheck';
    }

    if (!newStatus) return;

    try {
        await updateStoreOrderStatus(orderId, newStatus);

        addNotification({
            id: Date.now(),
            type: 'user',
            icon: userNotificationIcon,
            title: userNotificationTitle,
            description: userNotificationDescription,
            time: 'Just now',
            read: false,
        });
        
        toast({
          title: toastTitle,
          description: `Order #${orderId.slice(-6).toUpperCase()} has been updated.`
        });
    } catch (error) {
         console.error("Failed to update order status:", error);
         toast({
            title: "Error",
            description: "Could not update order status. Please try again.",
            variant: "destructive"
        });
    }
  };
  
  const getBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Order Returned Successfully':
        return 'default';
      case 'Return Rejected':
        return 'destructive';
      case 'Return Request Accepted':
          return 'secondary';
      case 'Return Requested':
      default:
        return 'outline';
    }
  };

  const filteredOrders = returnOrders.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status: OrderStatus) => {
    switch(status) {
        case 'Return Requested': return <HelpCircle className="h-5 w-5 text-amber-500" />;
        case 'Return Request Accepted': return <CheckCircle className="h-5 w-5 text-blue-500" />;
        case 'Order Returned Successfully': return <PackageCheck className="h-5 w-5 text-green-500" />;
        case 'Return Rejected': return <XCircle className="h-5 w-5 text-red-500" />;
        default: return <HelpCircle className="h-5 w-5 text-muted-foreground" />;
    }
  }


  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">
          Return Management
        </h1>
        <p className="text-muted-foreground mb-8">
          Review and process return requests from customers.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>All Return Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>
              A list of all return requests and their statuses.
            </CardDescription>
            <div className="relative pt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID or Name..."
                className="pl-10 w-full md:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
               <div className="p-4 space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : filteredOrders.length > 0 ? (
                <div className="divide-y divide-border">
                {filteredOrders.map((order) => (
                    <Collapsible
                    key={order.id}
                    open={openOrderId === order.id}
                    onOpenChange={() => handleToggle(order.id)}
                    className="group"
                    >
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                               {getStatusIcon(order.status)}
                               <div>
                                <p className="font-mono text-sm font-semibold">{order.id.slice(-6).toUpperCase()}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(order.date), 'dd/MM/yyyy')}</p>
                               </div>
                            </div>
                            <div className="hidden md:block">
                               <p className="font-semibold text-sm">{order.customer.name}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={getBadgeVariant(order.status)} className="w-48 justify-center text-center">{order.status}</Badge>
                                <p className="font-bold hidden sm:block">₹{order.total.toFixed(2)}</p>
                                 {openOrderId === order.id ? (
                                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-muted/20 p-4 lg:p-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <h4 className="font-semibold mb-4">Order Items ({order.items.length})</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Qty</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map(item => (
                                            <TableRow key={item.product!.id}>
                                                <TableCell className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                                        <Image src={item.product!.images[0]} alt={item.product!.name} fill className="object-cover" data-ai-hint={item.product!.dataAiHint}/>
                                                    </div>
                                                    <span className="font-medium">{item.product!.name}</span>
                                                </TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell className="text-right font-medium">₹{(item.product!.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div>
                                 <h4 className="font-semibold mb-4">
                                    Return Actions
                                 </h4>
                                 {order.status === 'Return Requested' && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground mb-2">User has requested a return. Please review and respond.</p>
                                        <Button className="w-full" onClick={() => handleReturnAction(order.id, 'accept-request')}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Accept Request
                                        </Button>
                                        <Button className="w-full" variant="destructive" onClick={() => handleReturnAction(order.id, 'reject-request')}>
                                            <XCircle className="mr-2 h-4 w-4" /> Reject Request
                                        </Button>
                                    </div>
                                 )}
                                 {order.status === 'Return Request Accepted' && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground mb-2">Return request accepted. Awaiting item collection.</p>
                                        <Button className="w-full" onClick={() => handleReturnAction(order.id, 'confirm-collection')}>
                                            <PackageCheck className="mr-2 h-4 w-4" /> Confirm Collection
                                        </Button>
                                    </div>
                                 )}
                                 {(order.status === 'Order Returned Successfully' || order.status === 'Return Rejected') && (
                                    <div className="flex items-center gap-2 rounded-md border p-3 bg-background">
                                        {order.status === 'Order Returned Successfully' && <CheckCircle className="h-5 w-5 text-green-600" />}
                                        {order.status === 'Return Rejected' && <XCircle className="h-5 w-5 text-destructive" />}
                                        <p className="font-semibold">{order.status}</p>
                                    </div>
                                 )}
                                 <Separator className="my-6"/>
                                 <h4 className="font-semibold mb-4">Shipping Address</h4>
                                 <div className="text-sm space-y-2 text-muted-foreground">
                                    <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>Phone: {order.shippingAddress.phone}</p>
                                    <p>Payment Method: <span className="font-semibold text-foreground">{order.paymentMethod}</span></p>
                                 </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                    </Collapsible>
                ))}
                </div>
            ) : (
                 <div className="text-center text-muted-foreground p-12">
                    There are no return requests to display.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
