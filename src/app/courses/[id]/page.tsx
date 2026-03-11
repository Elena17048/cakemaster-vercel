import { adminDb } from "@/lib/firebase-admin";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getCourse(id: string): Promise<any> {
  const doc = await adminDb.collection("courses").doc(id).get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  };
}

async function getDates(courseId: string): Promise<any[]> {
  const snapshot = await adminDb
    .collection("courseDates")
    .where("courseId", "==", courseId)
    .get();

  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export default async function CoursePage({ params }: any) {
  const course: any = await getCourse(params.id);
  const dates: any = await getDates(params.id);

  if (!course) {
    return <div>Kurz nenalezen</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">

      <h1 className="text-4xl font-bold mb-6">
        {course.title?.cs}
      </h1>

      <p className="mb-10 text-lg">
        {course.description?.cs}
      </p>

      <h2 className="text-2xl font-semibold mb-6">
        Dostupné termíny
      </h2>

      <div className="space-y-4">

        {dates.map((date: any) => {

          const availableSeats =
            (course.capacity || 0) - (date.bookedSeats || 0);

          const jsDate = date.date?.toDate
            ? date.date.toDate()
            : new Date(date.date._seconds * 1000);

          return (
            <div
              key={date.id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >

              <div>

                <div className="font-medium">
                  {jsDate.toLocaleDateString("cs-CZ")}
                </div>

                <div className="text-sm text-gray-600">
                  Volná místa: {availableSeats}
                </div>

                {availableSeats === 1 && (
                  <div className="text-orange-600 text-sm font-semibold">
                    ⚠ Poslední místo
                  </div>
                )}

              </div>

              {availableSeats === 0 ? (
                <span className="text-red-600 font-semibold">
                  Kurz je plně obsazen
                </span>
              ) : (
                <Link
                  href={`/courses/book?courseId=${course.id}&dateId=${date.id}`}
                >
                  <Button>Vybrat termín</Button>
                </Link>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}