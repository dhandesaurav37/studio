"use client";

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton';

const PremiumProductsPageClient = dynamic(() => import('./client-page'), { 
    ssr: false,
    loading: () => (
        <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <Skeleton className="h-12 w-1/2 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
            </div>
             <div className="flex flex-col items-center gap-6">
                <Skeleton className="h-12 w-full max-w-xl" />
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-44" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
            <main className="mt-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-[3/4] w-full" />
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                ))}
            </main>
        </div>
    )
});

export default function PremiumProductsPage() {
  return <PremiumProductsPageClient />;
}
