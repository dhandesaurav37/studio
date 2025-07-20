
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Package, ShoppingCart, Users, UploadCloud, PlusCircle, MoreHorizontal, Edit, Trash2, Search, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Product } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboardPage() {
  const { products, addProduct } = useStore();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productImages, setProductImages] = useState<File[]>([]);
  const allCategories = [...new Set(products.map((p) => p.category))];

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.get('product-name') as string,
        price: Number(formData.get('price')),
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        color: formData.get('colors') as string,
        sizes: [
            ...(formData.get('text-sizes') as string).split(',').map(s => s.trim()).filter(Boolean),
            ...(formData.get('numeric-sizes') as string).split(',').map(s => s.trim()).filter(Boolean)
        ],
        // Note: In a real app, you'd upload these images and get back URLs.
        // For this prototype, we'll use placeholder URLs.
        images: productImages.length > 0 ? productImages.map(f => URL.createObjectURL(f)) : ['https://placehold.co/600x800.png'],
        rating: 0,
        reviews: 0,
        dataAiHint: 'new product'
    };
    
    addProduct(newProduct);

    toast({
        title: "Product Added!",
        description: `"${newProduct.name}" has been successfully added to the store.`
    })
    
    setProductImages([]);
    e.currentTarget.reset();
  }

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === "All"
        ? true
        : product.category === selectedCategory
    );
  
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
            <div className="text-2xl font-bold">₹4,523,189</div>
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
            <div className="text-2xl font-bold">{products.length}</div>
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
            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" name="product-name" placeholder="e.g. Charcoal Crew-Neck Tee" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" placeholder="e.g. 4999" required/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="e.g. A classic crew-neck t-shirt..." required/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
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
                  <Input id="colors" name="colors" placeholder="e.g., Black, White, Blue" required/>
                </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="text-sizes">Text-based Sizes (comma-separated)</Label>
                  <Input id="text-sizes" name="text-sizes" placeholder="e.g., S, M, L, XL, XXL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeric-sizes">Numeric Sizes (comma-separated)</Label>
                  <Input id="numeric-sizes" name="numeric-sizes" placeholder="e.g., 28, 30, 32" />
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
                        <Input id="dropzone-file" type="file" className="hidden" multiple accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                    </label>
                </div>
                {productImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {productImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`preview ${index}`}
                          width={100}
                          height={100}
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                          className="rounded-md object-cover w-full aspect-square"
                        />
                         <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="new-arrival" name="new-arrival" />
                <Label htmlFor="new-arrival">Mark as New Arrival</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline">Manage Products</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-auto min-w-[160px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {allCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                       <div className="relative h-16 w-16 rounded-md overflow-hidden">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            data-ai-hint={product.dataAiHint}
                          />
                        </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">In Stock</Badge>
                    </TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleEditClick(product)}>
                            <Edit className="mr-2 h-4 w-4"/>Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          {selectedProduct && (
             <>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Make changes to "{selectedProduct.name}". Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-product-name">Product Name</Label>
                    <Input id="edit-product-name" defaultValue={selectedProduct.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price (₹)</Label>
                    <Input id="edit-price" type="number" defaultValue={selectedProduct.price} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" defaultValue={selectedProduct.description} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select defaultValue={selectedProduct.category}>
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-colors">Colors (comma-separated)</Label>
                    <Input id="edit-colors" defaultValue={selectedProduct.color} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-text-sizes">Text-based Sizes (comma-separated)</Label>
                    <Input id="edit-text-sizes" defaultValue={selectedProduct.sizes.filter(s => isNaN(parseInt(s))).join(', ')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-numeric-sizes">Numeric Sizes (comma-separated)</Label>
                    <Input id="edit-numeric-sizes" defaultValue={selectedProduct.sizes.filter(s => !isNaN(parseInt(s))).join(', ')} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="edit-new-arrival" defaultChecked={products.slice(0, 4).some(p => p.id === selectedProduct.id)} />
                  <Label htmlFor="edit-new-arrival">Mark as New Arrival</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

    