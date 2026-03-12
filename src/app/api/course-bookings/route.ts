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

    // hledání rezervace podle variabilního symbolu
    const snapshot = await adminDb
      .collection("courseBookings")
      .where("variableSymbol", "==", bookingId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const booking = snapshot.docs[0].data() as any;

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
      price: course?.price || 0,
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


export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      courseId,
      dateId,
      firstName,
      lastName,
      email,
      phone
    } = body;

    if (!courseId || !dateId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // generování variabilního symbolu
    const variableSymbol = Date.now().toString().slice(-10);

    const bookingRef = await adminDb
      .collection("courseBookings")
      .add({
        courseId,
        dateId,
        firstName,
        lastName,
        email,
        phone,
        variableSymbol,
        status: "pending",
        createdAt: new Date()
      });

    return NextResponse.json({
      success: true,
      bookingId: bookingRef.id
    });

  } catch (error) {

    console.error("Booking error:", error);

    return NextResponse.json(
      { error: "Booking failed" },
      { status: 500 }
    );

  }

}