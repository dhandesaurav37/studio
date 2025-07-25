
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useStore } from "@/hooks/use-store";

const ADMIN_EMAIL = "dhandesaurav37@gmail.com";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, authIsLoading } = useStore();

  useEffect(() => {
    if (!authIsLoading && user) {
        if (user.email === ADMIN_EMAIL) {
            router.replace("/admin/dashboard");
        } else {
            router.replace("/");
        }
    }
  }, [user, authIsLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      // The useEffect hook will handle redirection.
    } catch (error: any) {
      let errorMessage = "An unknown error occurred.";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password. Please try again.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
        default:
          errorMessage = "Failed to log in. Please try again later.";
          console.error(error);
          break;
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, you will receive a password reset link shortly.",
      });
    } catch (error: any) {
       toast({
        title: "Error",
        description: "Could not send password reset email. Please check the email address and try again.",
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (authIsLoading || (!authIsLoading && user)) {
    return (
       <div className="flex items-center justify-center min-h-[calc(100vh-18rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
       </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-18rem)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  className="ml-auto inline-block h-auto p-0 text-sm"
                  onClick={handleForgotPassword}
                  disabled={isLoading || !email}
                >
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              {isLoading ? "Signing In..." : "Sign in"}
            </Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
