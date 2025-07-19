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

const orders = [
  {
    id: "WW-84521",
    date: "June 15, 2024",
    status: "Delivered",
    total: 184.98,
  },
  {
    id: "WW-84199",
    date: "May 28, 2024",
    status: "Delivered",
    total: 54.99,
  },
  {
    id: "WW-83712",
    date: "April 5, 2024",
    status: "Cancelled",
    total: 129.99,
  },
];

export default function OrdersPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        My Orders
      </h1>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="font-headline">
                    Order #{order.id}
                  </CardTitle>
                  <CardDescription>Date: {order.date}</CardDescription>
                </div>
                <Badge
                  variant={
                    order.status === "Delivered"
                      ? "default"
                      : order.status === "Cancelled"
                      ? "destructive"
                      : "secondary"
                  }
                  className="self-start sm:self-center"
                >
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">
                  Total: ${order.total.toFixed(2)}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
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
