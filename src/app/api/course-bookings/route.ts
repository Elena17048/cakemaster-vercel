import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json(
      { error: "Missing bookingId" },
      { status: 400 }
    );
  }

  try {

    const bookingDoc = await adminDb
      .collection("courseBookings")
      .doc(bookingId)
      .get();

    if (!bookingDoc.exists) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const booking = bookingDoc.data() as any;

    const courseDoc = await adminDb
      .collection("courses")
      .doc(booking.courseId)
      .get();

    const course = courseDoc.data() as any;

    const dateDoc = await adminDb
      .collection("courseDates")
      .doc(booking.dateId)
      .get();

    const date = dateDoc.data() as any;

    return NextResponse.json({
      courseTitle: course?.title?.cs || "Kurz",
      price: Number(course?.price || 0),
      variableSymbol: booking.variableSymbol,
      date: date?.date || null
    });

  } catch (error) {

    console.error("GET booking error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}