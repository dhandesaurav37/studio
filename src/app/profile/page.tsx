
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
import { Button } from "@/components/ui/button";
import { User as UserIcon, Mail, Phone, Edit, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useStore, UserProfile } from "@/hooks/use-store";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { profile, setProfile } = useStore();
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Sync profile from store with auth data on load
        const currentProfile = {
          ...profile,
          name: currentUser.displayName || profile.name,
          email: currentUser.email || profile.email,
        };
        setProfile(currentProfile);
        setEditedProfile(currentProfile);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);


  const handleEditToggle = async () => {
    if (isEditing && user) {
      // Save logic
      try {
        if (editedProfile.name !== user.displayName) {
          await updateProfile(user, { displayName: editedProfile.name });
        }
        setProfile(editedProfile); // Save to global store
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Your profile has been updated.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      address: { ...prev.address, [id]: value },
    }));
  };

  if (isLoading) {
    return (
      <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-10 w-1/4 mb-8" />
          <Card>
            <CardHeader className="items-center text-center p-6 sm:p-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="px-6 sm:px-8 pb-4 space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <CardTitle className="text-3xl font-headline">{isEditing ? editedProfile.name : profile.name}</CardTitle>
          <CardDescription>Your personal account details.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 pb-4 space-y-6">
          {isEditing ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={editedProfile.name} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={editedProfile.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" type="tel" value={editedProfile.mobile} onChange={handleInputChange} placeholder="Enter your mobile number" />
              </div>
              <div className="grid gap-2">
                 <Label htmlFor="street">Address</Label>
                 <Input id="street" value={editedProfile.address.street} onChange={handleAddressChange} placeholder="Street" />
                 <div className="grid grid-cols-3 gap-2">
                   <Input id="city" value={editedProfile.address.city} onChange={handleAddressChange} placeholder="City" />
                   <Input id="state" value={editedProfile.address.state} onChange={handleAddressChange} placeholder="State" />
                   <Input id="pincode" value={editedProfile.address.pincode} onChange={handleAddressChange} placeholder="Pincode" />
                 </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-semibold">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-semibold">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-semibold">{profile.mobile || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  {profile.address.street ? (
                    <>
                      <p className="font-semibold">{profile.address.street}</p>
                      <p className="font-semibold">{profile.address.city}, {profile.address.state} - {profile.address.pincode}</p>
                    </>
                  ) : (
                    <p className="font-semibold">Not provided</p>
                  )}
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
