import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {

  const { bookingId } = await req.json();

  try {

    await adminDb
      .collection("courseBookings")
      .doc(bookingId)
      .update({
        status: "rejected"
      });

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.error("REJECT BOOKING ERROR:", error);

    return NextResponse.json({
      success: false
    });

  }

}