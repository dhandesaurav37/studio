
"use client";

import { useState } from "react";
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
import { adminOrders, AdminOrder } from "@/lib/admin-data";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Search, CheckCircle, Truck, XCircle as XCircleIcon } from "lucide-react";
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


export default function AdminOrdersPage() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>(adminOrders);
  const { updateOrderStatus, addNotification } = useStore();
  const { toast } = useToast();


  const handleToggle = (orderId: string) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    // Update local admin page state
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    // Update the static list so changes persist during session
    const orderInStaticList = adminOrders.find(o => o.id === orderId);
    if(orderInStaticList) {
        orderInStaticList.status = newStatus;
    }

    // Update global user state and send notification
    updateOrderStatus(orderId, newStatus);

    let notificationTitle = "";
    let notificationDescription = "";
    let notificationIcon = "Bell";

    switch(newStatus) {
      case "Shipped":
        notificationTitle = "Order Shipped";
        notificationDescription = `Your order #${orderId} is on its way.`;
        notificationIcon = "Truck";
        break;
      case "Delivered":
        notificationTitle = "Order Delivered";
        notificationDescription = `Your order #${orderId} has been delivered. Enjoy!`;
        notificationIcon = "CheckCircle";
        break;
      case "Cancelled":
        notificationTitle = "Order Cancelled";
        notificationDescription = `Your order #${orderId} has been cancelled.`;
        notificationIcon = "XCircleIcon";
        break;
      default:
        return; // Don't notify for "Pending"
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
      description: `Order #${orderId} has been marked as ${newStatus}.`
    })
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "secondary";
      case "Cancelled":
        return "destructive";
      case "Pending":
      default:
        return "outline";
    }
  };
  
  const getStatusIconColor = (status: OrderStatus) => {
     switch (status) {
      case "Delivered":
        return "text-green-500";
      case "Shipped":
        return "text-blue-500";
      case "Cancelled":
        return "text-red-500";
      case "Pending":
      default:
        return "text-amber-500";
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
                           <CheckCircle className={`h-5 w-5 ${getStatusIconColor(order.status)}`}/>
                           <div>
                            <p className="font-mono text-sm font-semibold">{order.id}</p>
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
                                        <TableRow key={item.product.id}>
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
