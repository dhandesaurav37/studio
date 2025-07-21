
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
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Search, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore, OrderStatus, UserOrder } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import type { AdminOrder } from "@/lib/admin-data";
import { adminOrders } from "@/lib/admin-data";

export default function AdminReturnOrdersPage() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { orders, updateOrderStatus, addNotification, getProductById } = useStore();
  const { toast } = useToast();
  
  // Use live orders from the store and find the associated admin data
  const returnOrders: AdminOrder[] = adminOrders.filter(o => 
    ['Return Requested', 'Returned', 'Return Rejected'].includes(o.status)
  );

  const handleToggle = (orderId: string) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };
  
  const handleReturnAction = (orderId: string, action: "accept" | "reject") => {
    const newStatus: OrderStatus = action === 'accept' ? 'Returned' : 'Return Rejected';
    const orderInStaticList = adminOrders.find(o => o.id === orderId);
    if(orderInStaticList) {
        orderInStaticList.status = newStatus;
    }

    updateOrderStatus(orderId, newStatus);

    addNotification({
        id: Date.now(),
        type: 'user',
        icon: action === 'accept' ? 'CheckCircle' : 'XCircle',
        title: `Return ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
        description: `Your return request for order #${orderId} has been ${action === 'accept' ? 'accepted' : 'rejected'}.`,
        time: 'Just now',
        read: false,
    });
    
    toast({
      title: `Return Request ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
      description: `Order #${orderId} has been updated.`
    });
  };

  const getBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Returned':
        return 'default'; // Using green-like color
      case 'Return Rejected':
        return 'destructive';
      case 'Return Requested':
      default:
        return 'secondary'; // Using a neutral/yellow-ish color for pending
    }
  };

  const filteredOrders = returnOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredOrders.length > 0 ? (
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
                               <div>
                                <p className="font-mono text-sm font-semibold">{order.id}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(order.date), 'dd/MM/yyyy')}</p>
                               </div>
                            </div>
                            <div>
                               <p className="font-semibold text-sm">{order.customer.name}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={getBadgeVariant(order.status)} className="w-32 justify-center">{order.status}</Badge>
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
                                            <TableRow key={item.product.id}>
                                                <TableCell className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" data-ai-hint={item.product.dataAiHint}/>
                                                    </div>
                                                    <span className="font-medium">{item.product.name}</span>
                                                </TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell className="text-right font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div>
                                 <h4 className="font-semibold mb-4">
                                    {order.status === 'Return Requested' ? 'Actions' : 'Status'}
                                 </h4>
                                 {order.status === 'Return Requested' ? (
                                    <div className="space-y-2">
                                        <Button className="w-full" onClick={() => handleReturnAction(order.id, 'accept')}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Accept Return
                                        </Button>
                                        <Button className="w-full" variant="destructive" onClick={() => handleReturnAction(order.id, 'reject')}>
                                            <XCircle className="mr-2 h-4 w-4" /> Reject Return
                                        </Button>
                                    </div>
                                 ) : (
                                    <div className="flex items-center gap-2 rounded-md border p-3 bg-background">
                                        {order.status === 'Returned' && <CheckCircle className="h-5 w-5 text-green-600" />}
                                        {order.status === 'Return Rejected' && <XCircle className="h-5 w-5 text-destructive" />}
                                        <p className="font-semibold">Return {order.status}</p>
                                    </div>
                                 )}
                                 <Separator className="my-6"/>
                                 <h4 className="font-semibold mb-4">Shipping & Payment</h4>
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

    