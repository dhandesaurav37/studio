
"use client";

import dynamic from 'next/dynamic'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


const SignupPageClient = dynamic(() => import('./client-page'), { 
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-[calc(100vh-18rem)] py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-sm">
            <CardHeader>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="grid gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter className="flex flex-col">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48 mt-4" />
            </CardFooter>
            </Card>
        </div>
    )
});


export default function SignupPage() {
  return <SignupPageClient />;
}
