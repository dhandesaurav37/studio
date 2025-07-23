
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Package, ShoppingCart, Users, UploadCloud, PlusCircle, MoreHorizontal, Edit, Trash2, Search, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/services/storage";
import { ref, push, set, update, onValue, remove } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import type { AdminOrder } from "@/lib/admin-data";
import { Skeleton } from "@/components/ui/skeleton";

const staticCategories = [
  "Shirts",
  "T-Shirts",
  "Oversized T-shirts",
  "Pants",
  "Jeans",
  "Trousers",
  "Shoes",
  "Bags",
  "Belts",
  "Socks",
  "Wallets",
  "Sweater",
  "Jackets",
  "Track Pants"
];


export default function AdminDashboardClientPage() {
  const { products } = useStore();
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedProductData, setEditedProductData] = useState<Partial<Product> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProductCategory, setNewProductCategory] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const allCategoriesForFilter = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  useEffect(() => {
    const ordersRef = ref(rtdb, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersData: AdminOrder[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(ordersData);
      } else {
        setOrders([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const dashboardStats = useMemo(() => {
    const totalRevenue = orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, order) => sum + order.total, 0);

    const newOrders = orders.filter(o => o.status === 'Pending').length;

    const totalUsers = new Set(orders.map(o => o.customer.email)).size;
    
    return { totalRevenue, newOrders, totalUsers };
  }, [orders]);


  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditedProductData({ ...product });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const productRef = ref(rtdb, `products/${productToDelete.id}`);
      await remove(productRef);
      toast({
        title: "Product Deleted",
        description: `"${productToDelete.name}" has been removed from the store.`
      });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    if (productImages.length === 0) {
        toast({ title: "Error", description: "Please upload at least one product image.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }
     if (!newProductCategory) {
      toast({ title: "Error", description: "Please select or enter a category.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    try {
        const imageUrls = await Promise.all(productImages.map(file => uploadImage(file)));

        const newProductData = {
            name: formValues['product-name'] as string,
            brand: formValues['brand-name'] as string,
            price: Number(formValues['price']),
            description: formValues['description'] as string,
            category: newProductCategory,
            color: formValues['colors'] as string,
            sizes: [
                ...(formValues['text-sizes'] as string).split(',').map(s => s.trim()).filter(Boolean),
                ...(formValues['numeric-sizes'] as string).split(',').map(s => s.trim()).filter(Boolean)
            ],
            images: imageUrls,
            rating: 0,
            reviews: 0,
            dataAiHint: 'new product'
        };

        const productsRef = ref(rtdb, 'products');
        const newProductRef = push(productsRef);
        await set(newProductRef, newProductData);


        toast({
            title: "Product Added!",
            description: `"${newProductData.name}" has been successfully added to the store.`
        });
        
        setProductImages([]);
        setNewProductCategory('');
        (e.target as HTMLFormElement).reset();

    } catch (error) {
        console.error("Error adding product: ", error);
        toast({ title: "Error", description: "Failed to add product. Please try again.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleSaveChanges = async () => {
    if (!selectedProduct || !editedProductData) return;
    setIsSaving(true);
    try {
      const productRef = ref(rtdb, `products/${selectedProduct.id}`);
      await update(productRef, editedProductData);
      toast({
        title: "Success!",
        description: `"${editedProductData.name}" has been updated.`
      });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      setEditedProductData(null);
    } catch (error) {
      console.error("Error updating product: ", error);
      toast({ title: "Error", description: "Failed to update product.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldName = id.replace('edit-', '');
    setEditedProductData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleEditSelectChange = (value: string) => {
    setEditedProductData(prev => ({ ...prev, category: value }));
  };
  
  const handleEditSizesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { id, value } = e.target;
     const currentTextSizes = (document.getElementById('edit-text-sizes') as HTMLInputElement)?.value || editedProductData?.sizes?.filter(s => isNaN(parseInt(s))).join(', ') || '';
     const currentNumericSizes = (document.getElementById('edit-numeric-sizes') as HTMLInputElement)?.value || editedProductData?.sizes?.filter(s => !isNaN(parseInt(s))).join(', ') || '';

     const textSizes = (id === 'edit-text-sizes' ? value : currentTextSizes).split(',').map(s => s.trim()).filter(Boolean);
     const numericSizes = (id === 'edit-numeric-sizes' ? value : currentNumericSizes).split(',').map(s => s.trim()).filter(Boolean);
     setEditedProductData(prev => ({ ...prev, sizes: [...textSizes, ...numericSizes] }));
  }

  const filteredProducts = useMemo(() => products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategoryFilter === "All"
        ? true
        : product.category === selectedCategoryFilter
    ), [products, searchTerm, selectedCategoryFilter]);
  
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
            {isLoading ? <Skeleton className="h-8 w-3/4" /> : (
                <div className="text-2xl font-bold">₹{dashboardStats.totalRevenue.toLocaleString('en-IN')}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Based on delivered orders
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
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : (
                <div className="text-2xl font-bold">{dashboardStats.newOrders}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Orders pending fulfillment
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
              Total active products
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
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : (
              <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Unique customers with orders
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
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input id="brand-name" name="brand-name" placeholder="e.g. White Wolf" required/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" placeholder="e.g. 4999" required/>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required value={newProductCategory} onValueChange={setNewProductCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {staticCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="e.g. A classic crew-neck t-shirt..." required/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="colors">Colors (comma-separated)</Label>
                  <Input id="colors" name="colors" placeholder="e.g., Black, White, Blue" required/>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="text-sizes">Text-based Sizes (comma-separated)</Label>
                  <Input id="text-sizes" name="text-sizes" placeholder="e.g., S, M, L, XL, XXL" />
                </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Button variant="outline" type="button" disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    {isSubmitting ? 'Adding Product...' : 'Add Product'}
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
                <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                  <SelectTrigger className="w-auto min-w-[160px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {allCategoriesForFilter.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
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
                  <TableHead>Brand</TableHead>
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
                    <TableCell>{product.brand}</TableCell>
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
                          <DropdownMenuItem onSelect={() => handleDeleteClick(product)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/>Delete
                          </DropdownMenuItem>
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
          {selectedProduct && editedProductData && (
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
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input id="edit-name" value={editedProductData.name || ''} onChange={handleEditInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-brand">Brand Name</Label>
                    <Input id="edit-brand" value={editedProductData.brand || ''} onChange={handleEditInputChange} />
                  </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="edit-price">Price (₹)</Label>
                        <Input id="edit-price" type="number" value={editedProductData.price || 0} onChange={(e) => setEditedProductData(prev => ({ ...prev, price: Number(e.target.value) }))} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select value={editedProductData.category} onValueChange={handleEditSelectChange}>
                          <SelectTrigger id="edit-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {staticCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                          </SelectContent>
                        </Select>
                    </div>
                 </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" value={editedProductData.description || ''} onChange={handleEditInputChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-color">Colors (comma-separated)</Label>
                    <Input id="edit-color" value={editedProductData.color || ''} onChange={handleEditInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-text-sizes">Text-based Sizes (comma-separated)</Label>
                    <Input id="edit-text-sizes" defaultValue={editedProductData.sizes?.filter(s => isNaN(parseInt(s))).join(', ')} onChange={handleEditSizesChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-numeric-sizes">Numeric Sizes (comma-separated)</Label>
                    <Input id="edit-numeric-sizes" defaultValue={editedProductData.sizes?.filter(s => !isNaN(parseInt(s))).join(', ')} onChange={handleEditSizesChange}/>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="edit-new-arrival" defaultChecked={products.slice(0, 4).some(p => p.id === selectedProduct.id)} />
                  <Label htmlFor="edit-new-arrival">Mark as New Arrival</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>Cancel</Button>
                <Button type="submit" onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{productToDelete?.name}" from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

    