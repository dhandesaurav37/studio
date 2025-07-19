import { Bell, Tag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: 1,
    icon: <Tag className="h-5 w-5" />,
    title: "Summer Sale is LIVE!",
    description: "Get up to 50% off on selected items. Don't miss out!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    icon: <Truck className="h-5 w-5" />,
    title: "Your order #WW-84521 has been delivered.",
    description: "We hope you enjoy your new gear!",
    time: "1 day ago",
    read: true,
  },
  {
    id: 3,
    icon: <Bell className="h-5 w-5" />,
    title: "New Arrivals: The Linen Collection",
    description: "Stay cool this summer with our new breathable linen shirts.",
    time: "3 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="container py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Notifications
        </h1>
        <Button variant="ghost">Mark all as read</Button>
      </div>

      <div className="bg-card rounded-lg border max-w-4xl mx-auto">
        <ul className="divide-y">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex items-start gap-4 p-4 sm:p-6 ${
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
                {notification.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {notification.time}
                </p>
              </div>
              {!notification.read && (
                <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-accent flex-shrink-0"></div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
