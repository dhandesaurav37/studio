
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
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Edit, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialUser = {
  name: "John Doe",
  email: "m@example.com",
  mobile: "+1 234 567 890",
  address: {
    street: "123 Style Avenue",
    city: "Fashion City",
    state: "Trends",
    pincode: "12345",
  },
};

export default function ProfilePage() {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(initialUser);

  const handleEditToggle = () => {
    if (isEditing) {
      setUser(editedUser);
    } else {
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      address: { ...prev.address, [id]: value },
    }));
  };

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          My Profile
        </h1>
        {!isEditing && (
          <Button variant="outline" onClick={handleEditToggle}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="items-center text-center p-6 sm:p-8">
          <CardTitle className="text-3xl font-headline">{isEditing ? editedUser.name : user.name}</CardTitle>
          <CardDescription>Your personal account details.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 pb-4 space-y-6">
          {isEditing ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={editedUser.name} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={editedUser.email} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" type="tel" value={editedUser.mobile} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                 <Label htmlFor="street">Address</Label>
                 <Input id="street" value={editedUser.address.street} onChange={handleAddressChange} placeholder="Street" />
                 <div className="grid grid-cols-3 gap-2">
                   <Input id="city" value={editedUser.address.city} onChange={handleAddressChange} placeholder="City" />
                   <Input id="state" value={editedUser.address.state} onChange={handleAddressChange} placeholder="State" />
                   <Input id="pincode" value={editedUser.address.pincode} onChange={handleAddressChange} placeholder="Pincode" />
                 </div>
              </div>
            </>
          ) : (
            <>
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
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-semibold">{user.address.street}</p>
                  <p className="font-semibold">{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
        {isEditing && (
            <CardFooter className="px-6 sm:px-8 pb-8 flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleEditToggle}>Save Changes</Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
