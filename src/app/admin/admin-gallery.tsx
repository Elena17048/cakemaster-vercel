
'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, UploadCloud, ChevronDown, Edit } from 'lucide-react';
import Image from 'next/image';
import { uploadGalleryImage, addGalleryImage, getGalleryImages, deleteGalleryImage, getCategories, updateGalleryImage } from '@/lib/api';
import type { GalleryImage, Category, PopulatedGalleryImage, GalleryImageUpdate } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


const PAGE_SIZE = 5;

const GalleryImageForm = ({ 
    image, 
    onSave, 
    onCancel, 
    isPending 
}: { 
    image?: PopulatedGalleryImage | null, 
    onSave: (formData: GalleryImageUpdate, newImageFile?: File | null) => void, 
    onCancel: () => void, 
    isPending: boolean 
}) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(image?.imageUrl || null);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(image?.categories.map(c => c.id) || []);
    const [description, setDescription] = useState(image?.description || { en: '', cs: '' });

    const { data: availableCategories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

     useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            if (imagePreview) URL.revokeObjectURL(imagePreview); // Clean up old blob URL
            setImagePreview(previewUrl);
        }
    };

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategoryIds(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

     const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>, lang: 'en' | 'cs') => {
        setDescription(prev => ({ ...prev, [lang]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            imageUrl: image?.imageUrl || '',
            description,
            categories: selectedCategoryIds
        }, imageFile);
    };
    
    const getCategoryNameById = (id: string) => {
        return availableCategories.find(cat => cat.id === id)?.name.en || id;
    }

    return (
         <form onSubmit={handleSubmit} className="space-y-6 pt-4">
             <div className="space-y-2">
                <Label htmlFor="gallery-image-upload">Cake Image</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                    {!imagePreview ? (
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    ) : (
                        <Image src={imagePreview} alt="Reference preview" width={100} height={100} className="mx-auto rounded-md object-cover h-24 w-24"/>
                    )}
                    <div className="flex text-sm text-muted-foreground">
                        <label htmlFor="gallery-image-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                        <span>{imagePreview ? 'Change image' : 'Upload an image'}</span>
                        <Input id="gallery-image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                        </label>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="categories">Categories</Label>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between" disabled={isLoadingCategories}>
                            <span>
                                {isLoadingCategories ? "Loading..." :
                                    selectedCategoryIds.length > 0
                                    ? `${selectedCategoryIds.length} selected`
                                    : "Select categories"}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                        {availableCategories.map(category => (
                             <DropdownMenuCheckboxItem
                                key={category.id}
                                checked={selectedCategoryIds.includes(category.id)}
                                onCheckedChange={() => handleCategoryToggle(category.id)}
                                onSelect={(e) => e.preventDefault()}
                                className="capitalize"
                            >
                                {category.name.en}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-wrap gap-1 pt-2">
                    {selectedCategoryIds.map(catId => (
                        <Badge key={catId} variant="secondary" className="capitalize">{getCategoryNameById(catId)}</Badge>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Tabs defaultValue="en">
                    <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="cs">Čeština</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en" className="pt-2">
                        <Textarea placeholder="Enter description in English" value={description.en} onChange={(e) => handleDescriptionChange(e, 'en')} />
                    </TabsContent>
                    <TabsContent value="cs" className="pt-2">
                        <Textarea placeholder="Zadejte popis v češtině" value={description.cs} onChange={(e) => handleDescriptionChange(e, 'cs')} />
                    </TabsContent>
                </Tabs>
            </div>
            <DialogFooter>
                 <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending || (!image && !imageFile)}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogFooter>
        </form>
    )
}


export function AdminGallery() {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<PopulatedGalleryImage | null>(null);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    
    const { 
        data: imagesData, 
        isLoading: isLoadingImages, 
        isError: isImagesError 
    } = useQuery({
        queryKey: ['galleryImages', 'admin', currentPage, selectedCategoryIds],
        queryFn: () => getGalleryImages({
            categoryIds: selectedCategoryIds,
            page: currentPage,
            pageSize: PAGE_SIZE,
        }),
        keepPreviousData: true,
    });
    
    const { data: availableCategories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const totalPages = Math.ceil((imagesData?.totalCount || 0) / PAGE_SIZE);

    const addMutation = useMutation({
        mutationFn: (data: { formData: GalleryImageUpdate, newImageFile: File | null }) => {
            return (async () => {
                if (!data.newImageFile) throw new Error('No image file selected');
                if (data.formData.categories.length === 0) throw new Error('Please select at least one category.');
                
                const imageUrl = await uploadGalleryImage(data.newImageFile);
                await addGalleryImage({ ...data.formData, imageUrl });
            })();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
            queryClient.invalidateQueries({ queryKey: ['galleryCategoriesWithPreviews'] });
            toast({ title: 'Success', description: 'Image uploaded to gallery.' });
            setIsAddDialogOpen(false);
        },
        onError: (error: any) => {
            toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
        }
    });
    
    const updateMutation = useMutation({
        mutationFn: (data: { id: string, formData: GalleryImageUpdate, newImageFile: File | null }) => {
            return (async () => {
                let imageUrl = data.formData.imageUrl;
                if (data.newImageFile) {
                    imageUrl = await uploadGalleryImage(data.newImageFile);
                }
                await updateGalleryImage(data.id, { ...data.formData, imageUrl });
            })();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
            queryClient.invalidateQueries({ queryKey: ['galleryCategoriesWithPreviews'] });
            toast({ title: 'Success', description: 'Image updated successfully.' });
            closeEditDialog();
        },
        onError: (error: any) => {
            toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteGalleryImage,
        onSuccess: () => {
            // Bug fix: If deleting the last item on a page, go back one page.
            if (imagesData?.images.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
            }
            queryClient.invalidateQueries({ queryKey: ['galleryCategoriesWithPreviews'] });
            toast({ title: 'Success', description: 'Image deleted from gallery.' });
        },
        onError: (error: any) => {
            toast({ title: 'Deletion Failed', description: error.message, variant: 'destructive' });
        }
    });
    
    const handleSaveImage = (formData: GalleryImageUpdate, newImageFile?: File | null) => {
        if (editingImage) {
            updateMutation.mutate({ id: editingImage.id, formData, newImageFile: newImageFile || null });
        } else {
            addMutation.mutate({ formData, newImageFile: newImageFile || null });
        }
    };

    const handleDeleteClick = (id: string) => {
        setImageToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (imageToDelete) {
            deleteMutation.mutate(imageToDelete);
        }
        setIsDeleteDialogOpen(false);
        setImageToDelete(null);
    };

    const openEditDialog = (image: PopulatedGalleryImage) => {
        setEditingImage(image);
        setIsEditDialogOpen(true);
    };
    
    const closeEditDialog = () => {
        setEditingImage(null);
        setIsEditDialogOpen(false);
    };

    const handleCategoryFilterToggle = (categoryId: string) => {
        setSelectedCategoryIds(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    return (
        <>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the gallery item
                        from the database and storage.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setImageToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload New Image</DialogTitle>
                    <DialogDescription>Add a new cake to the public gallery.</DialogDescription>
                </DialogHeader>
                <GalleryImageForm 
                    onSave={handleSaveImage} 
                    onCancel={() => setIsAddDialogOpen(false)} 
                    isPending={addMutation.isPending}
                />
            </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Gallery Image</DialogTitle>
                    <DialogDescription>Update the details for this image.</DialogDescription>
                </DialogHeader>
                <GalleryImageForm 
                    image={editingImage}
                    onSave={handleSaveImage} 
                    onCancel={closeEditDialog} 
                    isPending={updateMutation.isPending}
                />
            </DialogContent>
        </Dialog>
        
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Gallery Images</CardTitle>
                            <CardDescription>View and manage uploaded cake images.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="shrink-0">
                                        Filter by category <ChevronDown className="h-4 w-4 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {availableCategories.map(category => (
                                        <DropdownMenuCheckboxItem
                                            key={category.id}
                                            checked={selectedCategoryIds.includes(category.id)}
                                            onCheckedChange={() => handleCategoryFilterToggle(category.id)}
                                            onSelect={(e) => e.preventDefault()}
                                            className="capitalize"
                                        >
                                            {category.name.en}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button onClick={() => setIsAddDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                     {isLoadingImages ? (
                         <div className="flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                     ) : isImagesError ? (
                        <p className="text-destructive">Error loading gallery images.</p>
                     ) : imagesData && imagesData.images.length > 0 ? (
                        <>
                        <div className="space-y-4">
                            {imagesData.images.map(image => (
                                <Card key={image.id} className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-4 flex-grow overflow-hidden">
                                        <Image src={image.imageUrl} alt="Gallery cake" width={64} height={64} className="rounded-md object-cover w-16 h-16 flex-shrink-0" />
                                        <div className="flex flex-wrap gap-1 flex-grow overflow-hidden">
                                            {image.categories.map(cat => (
                                                <Badge key={cat.id} variant="secondary" className="capitalize">{cat.name.en}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 flex-shrink-0">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(image)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => handleDeleteClick(image.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <PaginationItem key={page}>
                                            <PaginationLink 
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                                                isActive={currentPage === page}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext 
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                        </>
                     ) : (
                        <p>No gallery images found for the selected filters.</p>
                     )}
                </CardContent>
            </Card>
        </div>
        </>
    );
}
