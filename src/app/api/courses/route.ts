import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 60;

export async function GET() {
  try {
    // 1️⃣ načti max 4 aktivní kurzy
    const coursesSnapshot = await adminDb
      .collection("courses")
      .where("active", "==", true)
      .limit(4)
      .get();

    const courses = coursesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // pokud nejsou kurzy, vrať prázdné pole
    if (courses.length === 0) {
      return NextResponse.json([]);
    }

    const courseIds = courses.map((c: any) => c.id);

    // 2️⃣ načti jen termíny těchto kurzů
    const datesSnapshot = await adminDb
      .collection("courseDates")
      .where("courseId", "in", courseIds)
      .get();

    const allDates = datesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3️⃣ spoj data
    const result = courses.map((course: any) => {

      const dates = allDates
        .filter((date: any) => date.courseId === course.id)

        // ✅ seřazení termínů od nejbližšího
        .sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })

        .map((date: any) => ({
          id: date.id,
          date: date.date,
          bookedSeats: date.bookedSeats || 0,
          availableSeats:
            (course.capacity || 0) - (date.bookedSeats || 0),
          isClosed: date.isClosed || false,
        }));

      return {
        ...course,
        dates,
      };
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate",
      },
    });

  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}