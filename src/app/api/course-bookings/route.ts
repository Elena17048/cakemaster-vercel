import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      courseId,
      dateId,
      firstName,
      lastName,
      email,
      phone,
    } = body;

    if (!courseId || !dateId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // reference na termín kurzu
    const dateRef = adminDb.collection("courseDates").doc(dateId);
    const dateDoc = await dateRef.get();

    if (!dateDoc.exists) {
      return NextResponse.json(
        { error: "Course date not found" },
        { status: 404 }
      );
    }

    const dateData: any = dateDoc.data();

    // reference na kurz
    const courseRef = adminDb.collection("courses").doc(courseId);
    const courseDoc = await courseRef.get();

    if (!courseDoc.exists) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const courseData: any = courseDoc.data();

    const capacity = courseData.capacity || 0;
    const bookedSeats = dateData.bookedSeats || 0;

    if (bookedSeats >= capacity) {
      return NextResponse.json(
        { error: "Course is full" },
        { status: 400 }
      );
    }

    // vytvoření rezervace (BEZ snížení kapacity)
    const bookingRef = await adminDb.collection("courseBookings").add({
      courseId,
      dateId,
      firstName,
      lastName,
      email,
      phone,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      bookingId: bookingRef.id,
    });

  } catch (error) {
    console.error("Booking error:", error);

    return NextResponse.json(
      { error: "Booking failed" },
      { status: 500 }
    );
  }
}