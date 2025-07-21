
"use client";

import { Bell, CheckCircle, Package, Tag, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/use-store";
import { adminOrders } from "@/lib/admin-data";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

const ADMIN_EMAIL = "dhandesaurav37@gmail.com";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, addNotification, updateOrderStatus } = useStore();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, []);

  const handleOrderAction = (
    notificationId: number,
    orderId: string,
    action: "accept" | "reject"
  ) => {
    const order = adminOrders.find((o) => o.id === orderId);
    if (order) {
      const newStatus = action === "accept" ? "Shipped" : "Cancelled";
      // In a real app, you'd update this in the database.
      // For now, we'll update the mock data.
      order.status = newStatus;
      
      // Update the user's order status in the global state
      updateOrderStatus(orderId, newStatus);
      
      // Add a notification for the user
      addNotification({
        id: Date.now(),
        type: 'user',
        icon: action === 'accept' ? 'Truck' : 'XCircle',
        title: `Order ${action === 'accept' ? 'Shipped' : 'Cancelled'}`,
        description: `Your order #${orderId} has been ${action === 'accept' ? 'shipped' : 'cancelled'}.`,
        time: 'Just now',
        read: false,
      });
    }
    markAsRead(notificationId);
  };
  
  const userNotifications = notifications.filter(n => n.type !== 'admin');
  const adminNotifications = notifications.filter(n => n.type === 'admin');
  
  const displayedNotifications = isAdmin ? adminNotifications : userNotifications;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Tag": return <Tag className="h-5 w-5" />;
      case "Truck": return <Truck className="h-5 w-5" />;
      case "Bell": return <Bell className="h-5 w-5" />;
      case "Package": return <Package className="h-5 w-5" />;
      case "XCircle": return <XCircle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  }

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            Notifications
          </h1>
          <Button variant="ghost" onClick={() => markAllAsRead(isAdmin ? 'admin' : 'user')}>Mark all as read</Button>
        </div>

        <div className="bg-card rounded-lg border">
          <ul className="divide-y">
            {displayedNotifications.length > 0 ? displayedNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 ${
                  !notification.read ? "bg-accent/10" : ""
                }`}
              >
                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    !notification.read
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {getIcon(notification.icon)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.time}
                  </p>
                  {notification.type === 'admin' && !notification.read && notification.orderId && (
                     <div className="flex gap-2 mt-4">
                        <Button size="sm" onClick={() => handleOrderAction(notification.id, notification.orderId!, 'accept')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleOrderAction(notification.id, notification.orderId!, 'reject')}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                     </div>
                  )}
                </div>
                {!notification.read && (
                  <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-destructive flex-shrink-0"></div>
                )}
              </li>
            )) : (
              <li className="text-center text-muted-foreground p-12">
                You have no new notifications.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
