import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Edit } from "lucide-react";

const user = {
  name: "John Doe",
  email: "m@example.com",
  mobile: "+1 234 567 890",
  avatar: "https://placehold.co/100x100.png",
};

export default function ProfilePage() {
  return (
    <div className="container py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          My Profile
        </h1>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-col items-center text-center p-6 sm:p-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="man portrait" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
          <CardDescription>Your personal account details.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 pb-8 space-y-6">
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-semibold">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Mobile Number</p>
              <p className="font-semibold">{user.mobile}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}