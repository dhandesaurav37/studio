
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AdsAndOffersPage() {
  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Advertise & Offers
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Offer
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Current Offers & Advertisements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
            <p>You haven't created any advertisements or offers yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
