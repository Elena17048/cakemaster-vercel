import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getCourses() {
  const res = await fetch("/api/courses", {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];

  return res.json();
}

export default async function OurCourses() {
  const courses = await getCourses();

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Kurzy
        </h1>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {courses.map((course: any) => (
          <Card
            key={course.id}
            className="flex flex-col md:flex-row overflow-hidden"
          >
            <div className="md:w-1/3">
              <Image
                src={course.imageUrl}
                alt={course.title?.cs || course.title?.en}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:w-2/3 flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {course.title?.cs}
                </CardTitle>

                <CardDescription>
                  {course.description?.cs}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {course.price} CZK
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration} min
                  </div>

                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {course.capacity} míst
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/courses/${course.id}`}>
                  <Button>Rezervovat kurz</Button>
                </Link>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}