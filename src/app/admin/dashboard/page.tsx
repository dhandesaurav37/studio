
"use client";

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboardClientPage = dynamic(() => import('./client-page'), { 
    ssr: false,
    loading: () => (
        <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-1/4 mb-8" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <div className="mt-8">
                <Skeleton className="h-[600px] w-full" />
            </div>
             <div className="mt-8">
                <Skeleton className="h-[500px] w-full" />
            </div>
        </div>
    )
});

export default function AdminDashboardPage() {
  return <AdminDashboardClientPage />;
}
