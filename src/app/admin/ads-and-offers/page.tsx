
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Loader2, Check, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo } from "react";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export interface Offer {
    id: string;
    name: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    appliesTo: 'categories' | 'products';
    targetIds: string[];
    isActive: boolean;
}

const BLANK_OFFER: Omit<Offer, 'id'> = {
    name: '',
    discountType: 'percentage',
    discountValue: 0,
    appliesTo: 'categories',
    targetIds: [],
    isActive: true,
};

export default function AdsAndOffersPage() {
    const { products } = useStore();
    const { toast } = useToast();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const [currentOffer, setCurrentOffer] = useState<Partial<Offer>>(BLANK_OFFER);
    const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);

    const allCategories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
    
    useEffect(() => {
        const offersRef = ref(rtdb, 'offers');
        const unsubscribe = onValue(offersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const offersData: Offer[] = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setOffers(offersData);
            } else {
                setOffers([]);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleCreateNew = () => {
        setCurrentOffer(BLANK_OFFER);
        setIsDialogOpen(true);
    };

    const handleEdit = (offer: Offer) => {
        setCurrentOffer(offer);
        setIsDialogOpen(true);
    };
    
    const handleDelete = (offer: Offer) => {
        setOfferToDelete(offer);
        setIsDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (!offerToDelete) return;
        setIsSaving(true);
        try {
            await remove(ref(rtdb, `offers/${offerToDelete.id}`));
            toast({ title: "Success", description: "Offer deleted successfully."});
            setIsDeleteDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete offer.", variant: "destructive" });
        } finally {
            setIsSaving(false);
            setOfferToDelete(null);
        }
    };
    
    const handleSaveOffer = async () => {
        if (!currentOffer.name || !currentOffer.discountValue || currentOffer.targetIds?.length === 0) {
            toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
            return;
        }
        
        setIsSaving(true);
        try {
            if (currentOffer.id) { // Update existing
                const offerRef = ref(rtdb, `offers/${currentOffer.id}`);
                await update(offerRef, {
                    name: currentOffer.name,
                    discountType: currentOffer.discountType,
                    discountValue: Number(currentOffer.discountValue),
                    appliesTo: currentOffer.appliesTo,
                    targetIds: currentOffer.targetIds,
                    isActive: currentOffer.isActive,
                });
                toast({ title: "Success", description: "Offer updated successfully."});
            } else { // Create new
                const offersRef = ref(rtdb, 'offers');
                const newOfferRef = push(offersRef);
                await set(newOfferRef, {
                    name: currentOffer.name,
                    discountType: currentOffer.discountType,
                    discountValue: Number(currentOffer.discountValue),
                    appliesTo: currentOffer.appliesTo,
                    targetIds: currentOffer.targetIds,
                    isActive: currentOffer.isActive,
                });
                toast({ title: "Success", description: "Offer created successfully."});
            }
            setIsDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to save offer.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const targetOptions = useMemo(() => {
        if (currentOffer.appliesTo === 'products') {
            return products.map(p => ({ value: p.id, label: p.name }));
        }
        return allCategories.map(c => ({ value: c, label: c }));
    }, [currentOffer.appliesTo, products, allCategories]);

    const MultiSelect = ({
        options,
        selected,
        onChange,
        placeholder = "Select items..."
    }: {
        options: {value: string; label: string}[],
        selected: string[],
        onChange: (selected: string[]) => void,
        placeholder?: string
    }) => {
        const [open, setOpen] = useState(false);

        const handleSelect = (value: string) => {
            const newSelected = selected.includes(value)
                ? selected.filter(item => item !== value)
                : [...selected, value];
            onChange(newSelected);
        };

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                        <span className="truncate">
                           {selected.length > 0 ? `${selected.length} selected` : placeholder}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                                        <Check className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")} />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    };

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Advertise & Offers
        </h1>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Offer
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Current Offers & Advertisements</CardTitle>
          <CardDescription>Manage your promotional offers and view their status.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Offer Name</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Applies To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow><TableCell colSpan={5} className="text-center">Loading offers...</TableCell></TableRow>
                    ) : offers.length > 0 ? (
                        offers.map(offer => (
                            <TableRow key={offer.id}>
                                <TableCell className="font-medium">{offer.name}</TableCell>
                                <TableCell>{offer.discountValue}{offer.discountType === 'percentage' ? '%' : ' (Fixed)'}</TableCell>
                                <TableCell className="capitalize">{offer.appliesTo} ({offer.targetIds.length})</TableCell>
                                <TableCell>
                                    <Badge variant={offer.isActive ? "default" : "outline"}>
                                        {offer.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
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
                                          <DropdownMenuItem onSelect={() => handleEdit(offer)}>
                                            <Edit className="mr-2 h-4 w-4"/>Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onSelect={() => handleDelete(offer)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4"/>Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                         <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                                You haven't created any advertisements or offers yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle className="font-headline">{currentOffer.id ? "Edit Offer" : "Create New Offer"}</DialogTitle>
                <DialogDescription>
                    {currentOffer.id ? "Update the details for this offer." : "Fill out the form to create a new promotional offer."}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Offer Name</Label>
                    <Input id="name" placeholder="e.g., 20% Off T-Shirts" value={currentOffer.name || ''} onChange={(e) => setCurrentOffer({...currentOffer, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Discount Type</Label>
                        <RadioGroup value={currentOffer.discountType} onValueChange={(value) => setCurrentOffer({...currentOffer, discountType: value as any})} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="percentage" id="percentage"/>
                                <Label htmlFor="percentage">Percentage</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fixed" id="fixed"/>
                                <Label htmlFor="fixed">Fixed</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="value">Discount Value</Label>
                        <Input id="value" type="number" placeholder="e.g., 20 or 500" value={currentOffer.discountValue || 0} onChange={(e) => setCurrentOffer({...currentOffer, discountValue: Number(e.target.value)})} />
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Applies To</Label>
                         <RadioGroup value={currentOffer.appliesTo} onValueChange={(value) => setCurrentOffer({...currentOffer, appliesTo: value as any, targetIds: []})} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="categories" id="categories"/>
                                <Label htmlFor="categories">Categories</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="products" id="products"/>
                                <Label htmlFor="products">Products</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="grid gap-2">
                         <Label htmlFor="targets">
                            Select {currentOffer.appliesTo === 'products' ? 'Products' : 'Categories'}
                         </Label>
                         <MultiSelect
                            options={targetOptions}
                            selected={currentOffer.targetIds || []}
                            onChange={(selected) => setCurrentOffer({...currentOffer, targetIds: selected})}
                            placeholder={`Select ${currentOffer.appliesTo}...`}
                         />
                    </div>
                 </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="isActive" checked={currentOffer.isActive} onCheckedChange={(checked) => setCurrentOffer({...currentOffer, isActive: checked})} />
                    <Label htmlFor="isActive">Offer is active</Label>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSaveOffer} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    {isSaving ? "Saving..." : "Save Offer"}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the offer
              "{offerToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOfferToDelete(null)} disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isSaving} className="bg-destructive hover:bg-destructive/90">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSaving ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
