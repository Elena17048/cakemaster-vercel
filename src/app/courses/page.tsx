
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Tag, User, Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '@/lib/api';
import type { Course } from '@/lib/types';

const defaultCourses: Course[] = [
    {
      id: "1",
      title: { en: "Introduction to Cake Decorating", cs: "Úvod do zdobení dortů" },
      description: { en: "Learn the fundamentals of cake decorating, from frosting techniques to piping basics. Perfect for beginners!", cs: "Naučte se základy zdobení dortů, od technik potahování po základy zdobení. Ideální pro začátečníky!" },
      imageUrl: "https://placehold.co/600x400.png",
      price: 2500,
      duration: 180,
      capacity: 10,
      level: "Beginner",
    },
    {
      id: "2",
      title: { en: "Advanced Fondant Techniques", cs: "Pokročilé techniky s fondánem" },
      description: { en: "Take your skills to the next level by mastering fondant sculpting, covering, and texturing.", cs: "Posuňte své dovednosti na další úroveň zvládnutím modelování, potahování a texturování fondánu." },
      imageUrl: "https://placehold.co/600x400.png",
      price: 3500,
      duration: 240,
      capacity: 8,
      level: "Amateur",
    },
];

export default function OurCourses() {
  const { t, i18n } = useTranslation('courses');
  const currentLang = i18n.language as 'en' | 'cs';

  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const displayCourses = courses && courses.length > 0 ? courses : defaultCourses;

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">{t('title')}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center mt-12">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : isError ? (
         <div className="text-center mt-12 text-destructive">
            <p>Error loading courses. Please try again later.</p>
         </div>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {displayCourses.map((course) => (
            <Card key={course.id} className="flex flex-col md:flex-row overflow-hidden transition-shadow duration-300 hover:shadow-xl">
              <div className="md:w-1/3">
                <Image
                  src={course.imageUrl || 'https://placehold.co/600x400.png'}
                  alt={course.title[currentLang] || course.title.en}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  data-ai-hint="baking class"
                />
              </div>
              <div className="md:w-2/3 flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{course.title[currentLang] || course.title.en}</CardTitle>
                  <CardDescription>{course.description[currentLang] || course.description.en}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                          <Tag className="h-4 w-4" />
                          <span>{course.price} CZK</span>
                      </div>
                       <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration} minutes</span>
                      </div>
                       <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          <span>{course.level}</span>
                      </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>{t('bookButton')}</Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
