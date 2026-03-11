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
      phone
    } = body;

    if (!courseId || !dateId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const bookingRef = await adminDb
      .collection("courseBookings")
      .add({
        courseId,
        dateId,
        firstName,
        lastName,
        email,
        phone,
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