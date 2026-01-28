
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getCorporatePageContent, updateCorporatePageContent, uploadCorporateImage, deleteCorporateImage } from '@/lib/api';
import type { CorporatePageContent, CorporateReview } from '@/lib/types';
import { Loader2, PlusCircle, Trash2, Edit, UploadCloud } from 'lucide-react';

const ReviewForm = ({ review, onSave, onCancel, isPending }: { review?: CorporateReview | null, onSave: (reviewData: Omit<CorporateReview, 'id'>) => void, onCancel: () => void, isPending: boolean }) => {
    const [name, setName] = useState(review?.name || '');
    const [text, setText] = useState(review?.text || { en: '', cs: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, text });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
                <Label htmlFor="review-name">Customer Name</Label>
                <Input id="review-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isPending} />
            </div>
            <Tabs defaultValue="en">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="cs">Čeština</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="pt-2">
                    <Textarea placeholder="Enter review in English" value={text.en} onChange={(e) => setText(prev => ({ ...prev, en: e.target.value }))} required disabled={isPending} />
                </TabsContent>
                <TabsContent value="cs" className="pt-2">
                    <Textarea placeholder="Zadejte recenzi v češtině" value={text.cs} onChange={(e) => setText(prev => ({ ...prev, cs: e.target.value }))} required disabled={isPending} />
                </TabsContent>
            </Tabs>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending || !name.trim() || !text.en.trim() || !text.cs.trim()}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Review'}
                </Button>
            </DialogFooter>
        </form>
    );
};


export function AdminCorporate() {
    const [isReviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<CorporateReview | null>(null);
    const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: content, isLoading, isError } = useQuery<CorporatePageContent>({
        queryKey: ['corporatePageContent'],
        queryFn: getCorporatePageContent,
    });

    const updateMutation = useMutation({
        mutationFn: updateCorporatePageContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['corporatePageContent'] });
            toast({ title: 'Success', description: 'Corporate page content updated.' });
        },
        onError: (error) => {
            toast({ title: 'Error', description: 'Could not update content.', variant: 'destructive' });
        }
    });

    const handleSaveReview = (reviewData: Omit<CorporateReview, 'id'>) => {
        if (!content) return;
        let updatedReviews: CorporateReview[];

        if (editingReview) {
            updatedReviews = (content.reviews || []).map(r => r.id === editingReview.id ? { ...r, ...reviewData } : r);
        } else {
            const newReview: CorporateReview = { ...reviewData, id: Date.now().toString() };
            updatedReviews = [...(content.reviews || []), newReview];
        }
        updateMutation.mutate({ ...content, reviews: updatedReviews });
        closeReviewDialog();
    };

    const handleDeleteReviewClick = (id: string) => {
        setReviewToDeleteId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteReview = () => {
        if (content && reviewToDeleteId) {
            const updatedReviews = (content.reviews || []).filter(r => r.id !== reviewToDeleteId);
            updateMutation.mutate({ ...content, reviews: updatedReviews });
        }
        setReviewToDeleteId(null);
        setDeleteDialogOpen(false);
    };
    
    const openAddReviewDialog = () => {
        setEditingReview(null);
        setReviewDialogOpen(true);
    };

    const openEditReviewDialog = (review: CorporateReview) => {
        setEditingReview(review);
        setReviewDialogOpen(true);
    };

    const closeReviewDialog = () => {
        setEditingReview(null);
        setReviewDialogOpen(false);
    };
    
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0] && content) {
            setUploadingIndex(index);
            try {
                const oldImageUrl = (content.galleryImages || [])[index];
                if (oldImageUrl) {
                    await deleteCorporateImage(oldImageUrl);
                }
                const newImageUrl = await uploadCorporateImage(e.target.files[0]);
                const updatedImages = [...(content.galleryImages || [])];
                updatedImages[index] = newImageUrl;
                
                for (let i = 0; i < updatedImages.length; i++) {
                    if (updatedImages[i] === undefined || updatedImages[i] === null) {
                        updatedImages[i] = "";
                    }
                }

                await updateMutation.mutateAsync({ ...content, galleryImages: updatedImages });
            } catch (error) {
                 toast({ title: 'Upload Failed', description: 'Could not upload image.', variant: 'destructive' });
            } finally {
                setUploadingIndex(null);
            }
        }
    };

    const handleImageRemove = async (index: number) => {
        if (!content) return;
        const imageUrlToRemove = (content.galleryImages || [])[index];
        if (!imageUrlToRemove) return;

        try {
            await deleteCorporateImage(imageUrlToRemove);
            const updatedImages = [...(content.galleryImages || [])];
            updatedImages[index] = "";
            await updateMutation.mutateAsync({ ...content, galleryImages: updatedImages });
            toast({ title: 'Success', description: 'Image removed.' });
        } catch (error) {
            toast({ title: 'Deletion Failed', description: 'Could not remove image.', variant: 'destructive' });
        }
    };


    if (isLoading) return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    if (isError) return <p className="text-destructive">Error loading corporate page content.</p>;
    
    const galleryImages = content?.galleryImages || [];

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Manage Reviews</CardTitle>
                        <Button onClick={openAddReviewDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add Review</Button>
                    </div>
                    <CardDescription>Add, edit, or delete customer testimonials for the corporate page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content?.reviews && content.reviews.length > 0 ? (
                        content.reviews.map(review => (
                            <div key={review.id} className="flex items-start justify-between p-3 border rounded-md gap-4">
                                <div className="flex-grow overflow-hidden">
                                    <p className="font-semibold truncate">{review.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1 italic truncate">&quot;{review.text.en}&quot;</p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditReviewDialog(review)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDeleteReviewClick(review.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Gallery Photos</CardTitle>
                    <CardDescription>Update the three photos displayed on the corporate page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   {Array.from({ length: 3 }).map((_, index) => {
                       const imageUrl = galleryImages[index];
                       return (
                            <div key={index} className="space-y-2">
                                <Label>Image Slot {index + 1}</Label>
                                <div className="flex items-center gap-4 p-2 border rounded-md">
                                    {imageUrl ? (
                                        <Image src={imageUrl} alt={`Corporate gallery image ${index + 1}`} width={64} height={64} className="rounded-md object-cover h-16 w-16" />
                                    ) : (
                                        <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                            <UploadCloud />
                                        </div>
                                    )}
                                    <div className="flex-grow space-y-2">
                                        <label htmlFor={`upload-corp-${index}`} className="w-full">
                                            <Button asChild variant="outline" className="w-full cursor-pointer">
                                                <div>
                                                    {uploadingIndex === index ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                                    {uploadingIndex === index ? 'Uploading...' : (imageUrl ? 'Change Image' : 'Upload Image')}
                                                </div>
                                            </Button>
                                            <Input id={`upload-corp-${index}`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, index)} disabled={uploadingIndex !== null} />
                                        </label>
                                        {imageUrl && (
                                            <Button variant="destructive" size="sm" className="w-full" onClick={() => handleImageRemove(index)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                       );
                   })}
                </CardContent>
            </Card>

            <Dialog open={isReviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingReview ? 'Edit Review' : 'Add New Review'}</DialogTitle>
                    </DialogHeader>
                    <ReviewForm review={editingReview} onSave={handleSaveReview} onCancel={closeReviewDialog} isPending={updateMutation.isPending} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the review.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setReviewToDeleteId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteReview}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
