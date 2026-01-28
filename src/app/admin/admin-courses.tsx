
'use client';

import { useState, useEffect }from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses, addCourse, updateCourse, deleteCourse, uploadCourseImage } from '@/lib/api';
import type { Course } from '@/lib/types';

type CourseFormData = {
  title: { en: string; cs: string };
  description: { en: string; cs: string };
  price: string | number;
  duration: string | number;
  capacity: string | number;
  level: Course['level'];
  imageUrl: string;
}

const CourseForm = ({ course, onSave, onCancel, isPending }: { course?: Course | null; onSave: (course: Omit<Course, 'id'>, imageFile?: File | null) => void; onCancel: () => void, isPending: boolean }) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: course?.title || { en: '', cs: '' },
    description: course?.description || { en: '', cs: '' },
    price: course?.price ?? '',
    duration: course?.duration ?? '',
    capacity: course?.capacity ?? '',
    level: course?.level || '',
    imageUrl: course?.imageUrl || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(course?.imageUrl || null);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleMultilingualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, lang: 'en' | 'cs') => {
    const { id, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [id]: {
            ...(prev[id as keyof typeof prev] as object),
            [lang]: value,
        },
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLevelChange = (value: Course['level']) => {
    setFormData(prev => ({...prev, level: value}));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseToSave = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        capacity: Number(formData.capacity),
    };
    await onSave(courseToSave, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="en">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="cs">Čeština</TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (EN)</Label>
            <Input id="title" value={formData.title.en} onChange={(e) => handleMultilingualChange(e, 'en')} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (EN)</Label>
            <Textarea id="description" value={formData.description.en} onChange={(e) => handleMultilingualChange(e, 'en')} required />
          </div>
        </TabsContent>
        <TabsContent value="cs" className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="title">Název (CS)</Label>
                <Input id="title" value={formData.title.cs} onChange={(e) => handleMultilingualChange(e, 'cs')} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Popis (CS)</Label>
                <Textarea id="description" value={formData.description.cs} onChange={(e) => handleMultilingualChange(e, 'cs')} required />
            </div>
        </TabsContent>
      </Tabs>
      
       <div className="space-y-2">
        <Label htmlFor="image">Course Image</Label>
        <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
        {imagePreview && (
            <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">Image Preview:</p>
                <Image src={imagePreview} alt="Course image preview" width={100} height={100} className="rounded-md object-cover" />
            </div>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (CZK)</Label>
          <Input id="price" type="number" value={formData.price} onChange={handleChange} placeholder="1500" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (mins)</Label>
          <Input id="duration" type="number" value={formData.duration} onChange={handleChange} placeholder="180" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="10" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select onValueChange={handleLevelChange} value={formData.level} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Amateur">Amateur</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Saving...' : 'Save Course'}
        </Button>
      </DialogFooter>
    </form>
  );
};


export function AdminCourses() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'cs';
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const { mutate: addCourseMutation, isPending: isAdding } = useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: 'Success', description: 'Course added successfully.' });
      closeDialog();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'There was an error adding the course.', variant: 'destructive' });
      console.error("Error adding course: ", error);
    }
  });

  const { mutate: updateCourseMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: 'Success', description: 'Course updated successfully.' });
      closeDialog();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'There was an error updating the course.', variant: 'destructive' });
      console.error("Error updating course: ", error);
    }
  });

  const { mutate: deleteCourseMutation } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: 'Success', description: 'Course deleted successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'There was an error deleting the course.', variant: 'destructive' });
      console.error("Error deleting course: ", error);
    }
  });

  const handleSaveCourse = async (courseData: Omit<Course, 'id' | 'imageUrl'> & {imageUrl?: string}, imageFile?: File | null) => {
      let imageUrl = courseData.imageUrl || editingCourse?.imageUrl || '';
      
      if (imageFile) {
        imageUrl = await uploadCourseImage(imageFile);
      }

      const finalCourseData = { ...courseData, imageUrl };

      if (editingCourse) {
        updateCourseMutation({ id: editingCourse.id, courseData: finalCourseData });
      } else {
        addCourseMutation(finalCourseData);
      }
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourseMutation(id);
    }
  };

  const openAddDialog = () => {
    setEditingCourse(null);
    setDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingCourse(null);
  }

  if (coursesError) {
      toast({ title: 'Error', description: 'Could not fetch courses.', variant: 'destructive' });
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          </DialogHeader>
          <CourseForm course={editingCourse} onSave={handleSaveCourse} onCancel={closeDialog} isPending={isAdding || isUpdating} />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Manage Courses</CardTitle>
                <CardDescription>Add, edit, or delete your baking courses.</CardDescription>
            </div>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {courses.length > 0 ? (
                courses.map(course => (
                  <Card key={course.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-4">
                    <div className="flex items-center gap-4">
                      {course.imageUrl && (
                          <Image src={course.imageUrl} alt={course.title.en} width={64} height={64} className="rounded-md object-cover w-16 h-16" />
                      )}
                      <div>
                          <h3 className="font-semibold">{course.title[currentLang] || course.title.en}</h3>
                          <p className="text-sm text-muted-foreground">{course.level} &middot; {course.duration} mins &middot; {course.price} CZK &middot; {course.capacity} people</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteCourse(course.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p>No courses found. Add one to get started!</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
