export const dynamic = "force-dynamic";
import { adminDb } from "@/lib/firebase-admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getCourses() {
  const snapshot = await adminDb.collection("courses").get();

  const courses = snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // zobraz jen aktivní kurzy
  return courses
    .filter((course: any) => course.active === true)
    .slice(0, 4);
}

export default async function OurCourses() {
  const courses = await getCourses();

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="text-center">
  <h1 className="text-4xl md:text-5xl font-bold">
    Cukrářské kurzy
  </h1>

  <p className="mt-4 text-lg text-muted-foreground">
    Myslíš, že to nezvládneš?<br />
    Ukážu ti, že ano. Krok za krokem.
  </p>
</div>

<div className="mt-16 grid gap-8 md:grid-cols-2">
        {courses.map((course: any) => (
          <Card
          key={course.id}
          className="flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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

  <p className="font-semibold text-sm mt-2">
    {course.description?.cs}
  </p>

  <p className="flex items-center gap-2 text-sm text-green-600 mt-2">
    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
    Vhodné i pro začátečníky
  </p>
</CardHeader>

<CardContent className="flex-grow mt-6">
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
                <Button>Zjistit více →</Button>
                </Link>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}