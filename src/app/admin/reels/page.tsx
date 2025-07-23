
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  PlusCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Video,
} from "lucide-react";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { rtdb, storage } from "@/lib/firebase";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Reel } from "@/lib/data";

const BLANK_REEL: Omit<Reel, "id"> & { id?: string } = {
  title: "",
  videoUrl: "",
  productId: "",
};

export default function ReelsPage() {
  const { products } = useStore();
  const { toast } = useToast();
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [currentReel, setCurrentReel] = useState<Partial<Reel>>(BLANK_REEL);
  const [reelToDelete, setReelToDelete] = useState<Reel | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const productOptions = useMemo(() => {
    return products.map((p) => ({ value: p.id, label: p.name }));
  }, [products]);

  useEffect(() => {
    const reelsRef = ref(rtdb, "reels");
    const unsubscribe = onValue(reelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reelsData: Reel[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setReels(reelsData);
      } else {
        setReels([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateNew = () => {
    setCurrentReel(BLANK_REEL);
    setVideoFile(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (reel: Reel) => {
    setCurrentReel(reel);
    setVideoFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (reel: Reel) => {
    setReelToDelete(reel);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reelToDelete) return;
    setIsSaving(true);
    try {
      await remove(ref(rtdb, `reels/${reelToDelete.id}`));
      toast({ title: "Success", description: "Reel deleted successfully." });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reel.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setReelToDelete(null);
    }
  };
  
  const handleVideoUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
        const videoStorageRef = storageRef(storage, `reels/${Date.now()}-${file.name}`);
        await uploadBytes(videoStorageRef, file);
        const downloadURL = await getDownloadURL(videoStorageRef);
        return downloadURL;
    } catch (error) {
        console.error("Video upload error:", error);
        toast({ title: "Upload Error", description: "Failed to upload video.", variant: "destructive"});
        return null;
    } finally {
        setIsUploading(false);
    }
  }

  const handleSaveReel = async () => {
    if (!currentReel.title || !currentReel.productId) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentReel.id && !videoFile) {
        toast({ title: "Error", description: "Please upload a video for a new reel.", variant: "destructive" });
        return;
    }

    setIsSaving(true);
    
    let videoUrl = currentReel.videoUrl;
    if(videoFile) {
        const newVideoUrl = await handleVideoUpload(videoFile);
        if(newVideoUrl) {
            videoUrl = newVideoUrl;
        } else {
            setIsSaving(false);
            return;
        }
    }

    const reelToSave = { ...currentReel, videoUrl };

    try {
      if (reelToSave.id) {
        // Update existing
        const reelRef = ref(rtdb, `reels/${reelToSave.id}`);
        const { id, ...dataToUpdate } = reelToSave;
        await update(reelRef, dataToUpdate);
        toast({ title: "Success", description: "Reel updated successfully." });
      } else {
        // Create new
        const reelsRef = ref(rtdb, "reels");
        const newReelRef = push(reelsRef);
        const { id, ...dataToCreate } = reelToSave;
        await set(newReelRef, dataToCreate);
        toast({ title: "Success", description: "Reel created successfully." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save reel:", error);
      toast({
        title: "Error",
        description: "Failed to save reel.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Watch & Shop Reels
        </h1>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Reel
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Reels</CardTitle>
          <CardDescription>
            Add, edit, or delete reels for the "Watch and Shop" section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reel Title</TableHead>
                <TableHead>Linked Product</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Loading reels...
                  </TableCell>
                </TableRow>
              ) : reels.length > 0 ? (
                reels.map((reel) => {
                    const product = products.find(p => p.id === reel.productId);
                    return (
                        <TableRow key={reel.id}>
                        <TableCell className="font-medium">{reel.title}</TableCell>
                        <TableCell>{product?.name || 'N/A'}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                                >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => handleEdit(reel)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                onSelect={() => handleDelete(reel)}
                                className="text-destructive"
                                >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    You haven't created any reels yet.
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
            <DialogTitle className="font-headline">
              {currentReel.id ? "Edit Reel" : "Create New Reel"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Reel Title</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Collection Highlights"
                value={currentReel.title || ""}
                onChange={(e) =>
                  setCurrentReel({ ...currentReel, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video">Video File</Label>
              <Input
                id="video"
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
              {currentReel.videoUrl && !videoFile && (
                <p className="text-sm text-muted-foreground mt-2">Current video: <a href={currentReel.videoUrl} target="_blank" rel="noopener noreferrer" className="underline">View here</a></p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Link to Product</Label>
              <Select
                value={currentReel.productId}
                onValueChange={(value) =>
                  setCurrentReel({ ...currentReel, productId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {productOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving || isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveReel} disabled={isSaving || isUploading}>
              {isSaving || isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save Reel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              reel "{reelToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setReelToDelete(null)}
              disabled={isSaving}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSaving}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSaving ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
