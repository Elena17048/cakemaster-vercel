import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 60; // cache 60 sekund

export async function GET() {
  try {
    // Načti kurzy
    const coursesSnapshot = await adminDb.collection("courses").get();
    const courses = coursesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Načti termíny
    const datesSnapshot = await adminDb.collection("courseDates").get();
    const allDates = datesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Spoj data
    const result = courses.map((course: any) => {
      const dates = allDates
        .filter((date: any) => date.courseId === course.id)
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