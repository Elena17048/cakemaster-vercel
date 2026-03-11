'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Trash2, Edit, PlusCircle, Loader2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  uploadCourseImage
} from '@/lib/api';

import type { Course } from '@/lib/types';



type CourseFormData = {
  title: { en: string; cs: string };
  description: { en: string; cs: string };
  price: string | number;
  duration: string | number;
  capacity: string | number;
  level: Course['level'];
  imageUrl: string;
};



const CourseForm = ({
  course,
  onSave,
  onCancel,
  isPending
}: {
  course?: Course | null;
  onSave: (course: Omit<Course, 'id'>, imageFile?: File | null) => void;
  onCancel: () => void;
  isPending: boolean;
}) => {

  const [formData, setFormData] = useState<CourseFormData>({
    title: course?.title || { en: '', cs: '' },
    description: course?.description || { en: '', cs: '' },
    price: course?.price ?? '',
    duration: course?.duration ?? '',
    capacity: course?.capacity ?? '',
    level: course?.level || '',
    imageUrl: course?.imageUrl || ''
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



  const handleMultilingualChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    lang: 'en' | 'cs'
  ) => {

    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: {
        ...(prev[id as keyof typeof prev] as any),
        [lang]: value
      }
    }));
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };



  const handleLevelChange = (value: Course['level']) => {

    setFormData(prev => ({
      ...prev,
      level: value
    }));
  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    setImageFile(file);

    const preview = URL.createObjectURL(file);

    setImagePreview(preview);
  };



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const courseToSave = {
      ...formData,
      price: Number(formData.price),
      duration: Number(formData.duration),
      capacity: Number(formData.capacity)
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
            <Input
              id="title"
              value={formData.title.en}
              onChange={(e) => handleMultilingualChange(e, 'en')}
              required
            />
          </div>



          <div className="space-y-2">
            <Label htmlFor="description">Description (EN)</Label>
            <Textarea
              id="description"
              value={formData.description.en}
              onChange={(e) => handleMultilingualChange(e, 'en')}
              required
            />
          </div>

        </TabsContent>



        <TabsContent value="cs" className="space-y-4 pt-4">

          <div className="space-y-2">
            <Label htmlFor="title">Název (CS)</Label>
            <Input
              id="title"
              value={formData.title.cs}
              onChange={(e) => handleMultilingualChange(e, 'cs')}
              required
            />
          </div>



          <div className="space-y-2">
            <Label htmlFor="description">Popis (CS)</Label>
            <Textarea
              id="description"
              value={formData.description.cs}
              onChange={(e) => handleMultilingualChange(e, 'cs')}
              required
            />
          </div>

        </TabsContent>

      </Tabs>



      <div className="space-y-2">

        <Label htmlFor="image">Course Image</Label>

        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {imagePreview && (
          <Image
            src={imagePreview}
            alt="preview"
            width={100}
            height={100}
            className="rounded-md object-cover"
          />
        )}

      </div>



      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" value={formData.price} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" type="number" value={formData.duration} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" type="number" value={formData.capacity} onChange={handleChange} />
        </div>

        <div className="space-y-2">

          <Label htmlFor="level">Level</Label>

          <Select onValueChange={handleLevelChange} value={formData.level}>

            <SelectTrigger>
              <SelectValue placeholder="Select level" />
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

        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

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

  const currentLang = (i18n?.language || 'cs') as 'en' | 'cs';

  const queryClient = useQueryClient();



  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
  });



  const { mutate: addCourseMutation, isPending: isAdding } = useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: 'Success', description: 'Course added.' });
      closeDialog();
    }
  });



  const { mutate: updateCourseMutation, isPending: isUpdating } = useMutation<
    void,
    Error,
    { id: string; data: Partial<Course> }
  >({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: 'Success', description: 'Course updated.' });
      closeDialog();
    }
  });



  const { mutate: deleteCourseMutation } = useMutation<void, Error, string>({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: 'Deleted', description: 'Course removed.' });
    }
  });



  const handleSaveCourse = async (
    courseData: Omit<Course, 'id' | 'imageUrl'> & { imageUrl?: string },
    imageFile?: File | null
  ) => {

    let imageUrl = courseData.imageUrl || editingCourse?.imageUrl || '';

    if (imageFile) {
      imageUrl = await uploadCourseImage(imageFile);
    }

    const finalData = { ...courseData, imageUrl };

    if (editingCourse) {
      updateCourseMutation({
        id: editingCourse.id,
        data: finalData
      });
    } else {
      addCourseMutation(finalData);
    }
  };



  const handleDeleteCourse = (id: string) => {

    if (window.confirm('Delete this course?')) {
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
  };



  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={(o) => (!o ? closeDialog() : setDialogOpen(true))}>

        <DialogContent className="sm:max-w-[725px]">

          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Add Course'}
            </DialogTitle>
          </DialogHeader>

          <CourseForm
            course={editingCourse}
            onSave={handleSaveCourse}
            onCancel={closeDialog}
            isPending={isAdding || isUpdating}
          />

        </DialogContent>

      </Dialog>



      <Card>

        <CardHeader>

          <div className="flex justify-between items-center">

            <div>
              <CardTitle>Manage Courses</CardTitle>
              <CardDescription>Add, edit or delete courses</CardDescription>
            </div>

            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course
            </Button>

          </div>

        </CardHeader>



        <CardContent>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (

            <div className="space-y-4">

              {courses.length > 0 ? (
                courses.map(course => (

                  <Card key={course.id} className="flex justify-between items-center p-4">

                    <div className="flex items-center gap-4">

                      {course.imageUrl && (
                        <Image
                          src={course.imageUrl}
                          alt={course.title?.en || ''}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      )}

                      <div>

                        <h3 className="font-semibold">
                          {course.title?.[currentLang] || course.title?.en}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {course.level} · {course.duration} min · {course.price} CZK · {course.capacity} people
                        </p>

                      </div>

                    </div>



                    <div className="flex gap-2">

                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>

                    </div>

                  </Card>

                ))
              ) : (
                <p>No courses found.</p>
              )}

            </div>

          )}

        </CardContent>

      </Card>

    </>
  );
}