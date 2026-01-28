
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, UploadCloud, Edit, GripVertical } from 'lucide-react';
import { getCategories, addCategory, deleteCategory, uploadCategoryImage, updateCategory, updateCategoryOrder } from '@/lib/api';
import type { Category } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
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
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const CategoryForm = ({
  category,
  onSave,
  onCancel,
  isPending
}: {
  category?: Category | null,
  onSave: (formData: Omit<Category, 'id' | 'order'>, imageFile?: File | null) => void,
  onCancel: () => void,
  isPending: boolean
}) => {
    const [name, setName] = useState(category?.name || { en: '', cs: '' });
    const [description, setDescription] = useState(category?.description || { en: '', cs: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(category?.imageUrl || null);
    
    useEffect(() => {
        // Cleanup blob URL
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
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(previewUrl);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, imageUrl: category?.imageUrl || '' }, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <Tabs defaultValue="en">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="cs">Čeština</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category-en">Name (EN)</Label>
                        <Input
                            id="category-en"
                            value={name.en}
                            onChange={(e) => setName(prev => ({ ...prev, en: e.target.value }))}
                            placeholder="e.g., Wedding"
                            disabled={isPending}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="desc-en">Description (EN)</Label>
                        <Textarea
                            id="desc-en"
                            value={description.en}
                            onChange={(e) => setDescription(prev => ({ ...prev, en: e.target.value }))}
                            placeholder="A collection of our finest wedding cakes."
                            disabled={isPending}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="cs" className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category-cs">Name (CS)</Label>
                        <Input
                            id="category-cs"
                            value={name.cs}
                            onChange={(e) => setName(prev => ({ ...prev, cs: e.target.value }))}
                            placeholder="e.g., Svatební"
                            disabled={isPending}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="desc-cs">Description (CS)</Label>
                        <Textarea
                            id="desc-cs"
                            value={description.cs}
                            onChange={(e) => setDescription(prev => ({ ...prev, cs: e.target.value }))}
                            placeholder="Kolekce našich nejlepších svatebních dortů."
                            disabled={isPending}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            <div className="space-y-2">
                <Label htmlFor="category-image-upload">Category Image</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {!imagePreview ? (
                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        ) : (
                            <Image src={imagePreview} alt="Category preview" width={100} height={100} className="mx-auto rounded-md object-cover h-24 w-24" />
                        )}
                        <div className="flex text-sm text-muted-foreground">
                            <label htmlFor="category-image-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                                <span>{imagePreview ? 'Change image' : 'Upload an image'}</span>
                                <Input id="category-image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending || !name.en.trim() || !name.cs.trim()}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </form>
    );
};

function SortableCategoryItem({ category }: { category: Category }) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language as 'en' | 'cs';
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-start justify-between p-2 border rounded-md gap-4 bg-card">
            <div className="flex items-center gap-4 flex-grow overflow-hidden">
                <div {...listeners} {...attributes} className="cursor-grab touch-none p-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                {category.imageUrl && (
                    <Image
                        src={category.imageUrl}
                        alt={category.name[currentLang] || category.name.en}
                        width={64}
                        height={64}
                        className="rounded-md object-cover w-16 h-16 flex-shrink-0"
                    />
                )}
                <div className="capitalize flex-grow overflow-hidden">
                    <p className="font-medium truncate">{category.name[currentLang] || category.name.en}</p>
                    <p className="text-sm text-muted-foreground mt-1 italic truncate">
                        {category.description?.[currentLang] || category.description?.en}
                    </p>
                </div>
            </div>
            {/* Action buttons are passed in as children */}
        </div>
    );
}

export function AdminCategories() {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { i18n } = useTranslation();

    const { data: categories = [], isLoading, isError } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });
    
    const [sortedCategories, setSortedCategories] = useState<Category[]>(categories);

    useEffect(() => {
        if (categories) {
            setSortedCategories(categories);
        }
    }, [categories]);

    const addMutation = useMutation({
        mutationFn: (data: { categoryData: Omit<Category, 'id' | 'order'>, imageFile: File | null }) => {
            return (async () => {
                let imageUrl = '';
                if (data.imageFile) {
                    imageUrl = await uploadCategoryImage(data.imageFile);
                }
                await addCategory({ ...data.categoryData, imageUrl });
            })();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: 'Success', description: 'Category added.' });
            closeEditDialog();
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: 'Could not add category.', variant: 'destructive' });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: string, categoryData: Omit<Category, 'id' | 'order'>, imageFile: File | null }) => {
            return (async () => {
                let imageUrl = data.categoryData.imageUrl;
                if (data.imageFile) {
                    imageUrl = await uploadCategoryImage(data.imageFile);
                }
                await updateCategory({ id: data.id, categoryData: { ...data.categoryData, imageUrl } });
            })();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: 'Success', description: 'Category updated.' });
            closeEditDialog();
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: 'Could not update category.', variant: 'destructive' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: 'Success', description: 'Category deleted.' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: 'Could not delete category.', variant: 'destructive' });
        }
    });
    
     const orderUpdateMutation = useMutation({
        mutationFn: updateCategoryOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: 'Success', description: 'Category order saved.' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: 'Could not save order.', variant: 'destructive' });
            // Revert optimistic update
            setSortedCategories(categories);
        }
    });


    const handleSaveCategory = (formData: Omit<Category, 'id' | 'order'>, imageFile?: File | null) => {
        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, categoryData: formData, imageFile: imageFile || null });
        } else {
            addMutation.mutate({ categoryData: formData, imageFile: imageFile || null });
        }
    };
    
    const openAddDialog = () => {
        setEditingCategory(null);
        setIsEditDialogOpen(true);
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setIsEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setEditingCategory(null);
        setIsEditDialogOpen(false);
    };

    const handleDeleteClick = (id: string) => {
        setCategoryToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            deleteMutation.mutate(categoryToDelete);
        }
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setSortedCategories((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over?.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                
                orderUpdateMutation.mutate(newOrder);

                return newOrder;
            });
        }
    }

    return (
        <>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the category
                            and its associated image from the server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                         <DialogDescription>
                            {editingCategory ? 'Update the details for this category.' : 'Create a new category for the gallery.'}
                        </DialogDescription>
                    </DialogHeader>
                    <CategoryForm 
                        category={editingCategory} 
                        onSave={handleSaveCategory} 
                        onCancel={closeEditDialog}
                        isPending={addMutation.isPending || updateMutation.isPending} 
                    />
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Manage Categories</CardTitle>
                            <CardDescription>Drag and drop to reorder categories.</CardDescription>
                        </div>
                        <Button onClick={openAddDialog}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : isError ? (
                        <p className="text-destructive">Error loading categories.</p>
                    ) : sortedCategories.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sortedCategories.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {sortedCategories.map(cat => (
                                       <div key={cat.id} className="flex items-center">
                                            <div className="flex-grow">
                                                <SortableCategoryItem category={cat} />
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0 ml-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(cat)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDeleteClick(cat.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                       </div>
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <p>No categories found.</p>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
