
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Package, ShoppingCart, Users, UploadCloud, PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { products } from "@/lib/data";

const allCategories = [...new Set(products.map((p) => p.category))];

export default function AdminDashboardPage() {
  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        Admin Dashboard
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products in Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              12 products are low on stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,257</div>
            <p className="text-xs text-muted-foreground">
              +10 since last week
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="e.g. Charcoal Crew-Neck Tee" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" placeholder="e.g. 49.99" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="e.g. A classic crew-neck t-shirt..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colors">Colors (comma-separated)</Label>
                  <Input id="colors" placeholder="e.g., Black, White, Blue" />
                </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="text-sizes">Text-based Sizes (comma-separated)</Label>
                  <Input id="text-sizes" placeholder="e.g., S, M, L, XL, XXL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeric-sizes">Numeric Sizes (comma-separated)</Label>
                  <Input id="numeric-sizes" placeholder="e.g., 28, 30, 32" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-images">Product Images</Label>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Drag & drop files here</span>, or click to select files</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple />
                    </label>
                </div> 
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="new-arrival" />
                <Label htmlFor="new-arrival">Mark as New Arrival</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit" className="bg-destructive hover:bg-destructive/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
