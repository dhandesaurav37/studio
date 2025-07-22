
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AdminOrder } from "@/lib/admin-data";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Search, CheckCircle, Truck, XCircle as XCircleIcon, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore, OrderStatus } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { ref, onValue, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";


export default function AdminOrdersPage() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateOrderStatus: updateUserOrderStatus, addNotification } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    const ordersRef = ref(rtdb, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const ordersData: AdminOrder[] = Object.keys(data).map(key => ({
                ...data[key],
                id: key, // Use firebase key as the unique id
            })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setOrders(ordersData);
        } else {
            setOrders([]);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggle = (orderId: string) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };
  
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const orderRef = ref(rtdb, `orders/${orderId}`);
    const deliveryDate = newStatus === 'Delivered' ? new Date().toISOString() : null;

    try {
        await update(orderRef, { status: newStatus, deliveryDate });
        
        // This will trigger the onValue listener to update the local state
        // setOrders(orders.map(order => 
        //   order.id === orderId ? { ...order, status: newStatus, deliveryDate: deliveryDate || order.deliveryDate } : order
        // ));

        // Update global user state and send notification
        updateUserOrderStatus(orderId, newStatus, deliveryDate || undefined);

        let notificationTitle = "";
        let notificationDescription = "";
        let notificationIcon = "Bell";

        switch(newStatus) {
          case "Shipped":
            notificationTitle = "Order Shipped";
            notificationDescription = `Your order #${orderId.slice(-6).toUpperCase()} is on its way.`;
            notificationIcon = "Truck";
            break;
          case "Delivered":
            notificationTitle = "Order Delivered";
            notificationDescription = `Your order #${orderId.slice(-6).toUpperCase()} has been delivered. Enjoy!`;
            notificationIcon = "CheckCircle";
            break;
          case "Cancelled":
            notificationTitle = "Order Cancelled";
            notificationDescription = `Your order #${orderId.slice(-6).toUpperCase()} has been cancelled.`;
            notificationIcon = "XCircleIcon";
            break;
          default:
            return; // Don't notify for "Pending" or returns
        }

        addNotification({
            id: Date.now(),
            type: 'user',
            icon: notificationIcon,
            title: notificationTitle,
            description: notificationDescription,
            time: 'Just now',
            read: false,
        });
        
        toast({
          title: "Order Updated",
          description: `Order #${orderId.slice(-6).toUpperCase()} has been marked as ${newStatus}.`
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
  
  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      ['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(order.status)
  );

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "secondary";
      case "Cancelled":
        return "destructive";
      case 'Return Requested':
      case 'Returned':
      case 'Return Rejected':
        return 'destructive';
      case "Pending":
      default:
        return "outline";
    }
  };
  
  const getStatusIcon = (status: OrderStatus) => {
     switch (status) {
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "Cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "Pending":
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  }

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">
          Manage Orders
        </h1>
        <p className="text-muted-foreground mb-8">
          View, search, and update the status of all customer orders.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>
              A list of all orders placed in your store.
            </CardDescription>
            <div className="relative pt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID, Name, or Email..."
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
            ) : (
                <div className="divide-y divide-border">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
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
                            <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={getStatusBadgeVariant(order.status)} className="w-24 justify-center">{order.status}</Badge>
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
                                            <TableHead>Size</TableHead>
                                            <TableHead>Qty</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map(item => (
                                            <TableRow key={item.productId}>
                                                <TableCell className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" data-ai-hint={item.product.dataAiHint}/>
                                                    </div>
                                                    <span className="font-medium">{item.product.name}</span>
                                                </TableCell>
                                                <TableCell>{item.size}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell className="text-right font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Shipping & Payment</h4>
                                <div className="text-sm space-y-2 text-muted-foreground">
                                    <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>Phone: {order.shippingAddress.phone}</p>
                                    <p>Payment Method: <span className="font-semibold text-foreground">{order.paymentMethod}</span></p>
                                </div>
                                <Separator className="my-6"/>
                                <h4 className="font-semibold mb-4">Update Status</h4>
                                <Select value={order.status} onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Change status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Shipped">Shipped</SelectItem>
                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CollapsibleContent>
                    </Collapsible>
                )) : (
                    <div className="text-center p-12 text-muted-foreground">
                        <p>No orders to display.</p>
                    </div>
                )}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    