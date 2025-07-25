
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { deleteUser } from "firebase/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { profile, setProfile } = useStore();
  const { toast } = useToast();
  const router = useRouter();

  // Local state to manage edits before saving
  const [localEmailNotifications, setLocalEmailNotifications] = useState(profile.emailNotifications);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    // Sync local state when profile from store changes
    setLocalEmailNotifications(profile.emailNotifications);
  }, [profile.emailNotifications]);

  const handleSaveChanges = () => {
    setProfile({ ...profile, emailNotifications: localEmailNotifications });
    toast({
        title: "Settings Saved",
        description: "Your preferences have been updated.",
    });
  }

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
        toast({ title: "Error", description: "No user is currently logged in.", variant: "destructive" });
        return;
    }

    setIsDeleting(true);
    try {
        await deleteUser(user);
        toast({
            title: "Account Deleted",
            description: "Your account has been permanently deleted.",
        });
        router.push('/'); // Redirect to home page after deletion
    } catch (error: any) {
        let errorMessage = "Could not delete your account. Please try again.";
        if (error.code === 'auth/requires-recent-login') {
            errorMessage = "This is a sensitive operation. Please log out and log back in before deleting your account.";
        }
        toast({
            title: "Deletion Failed",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-1/4 mb-8" />
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-11" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-16 mb-4" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
          Settings
        </h1>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications from us.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates on new products and offers.
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={localEmailNotifications}
                  onCheckedChange={setLocalEmailNotifications}
                  aria-label="Toggle email notifications"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label className="text-base">Theme</Label>
              <RadioGroup
                className="grid sm:grid-cols-3 gap-4 mt-4"
                onValueChange={setTheme}
                value={theme}
              >
                <div>
                  <RadioGroupItem
                    value="light"
                    id="light"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="w-full bg-background p-2 rounded-sm border mb-2">
                      <div className="h-2 w-full rounded-sm bg-primary" />
                      <div className="h-2 w-1/2 rounded-sm bg-primary/50 mt-1" />
                    </div>
                    Light
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="w-full bg-foreground p-2 rounded-sm border border-border mb-2">
                      <div className="h-2 w-full rounded-sm bg-primary-foreground" />
                      <div className="h-2 w-1/2 rounded-sm bg-primary-foreground/50 mt-1" />
                    </div>
                    Dark
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="system"
                    id="system"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="w-full bg-background p-2 rounded-sm border mb-2">
                      <div className="h-2 w-full rounded-sm bg-primary" />
                      <div className="h-2 w-1/2 rounded-sm bg-primary/50 mt-1" />
                    </div>
                    System
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="font-headline text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Once you delete your account, there is no going back. Please be certain.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
