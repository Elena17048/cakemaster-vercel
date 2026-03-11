import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const dateId = searchParams.get("dateId");

  if (!dateId) {
    return NextResponse.json(
      { error: "Missing dateId" },
      { status: 400 }
    );
  }

  const dateDoc = await adminDb
    .collection("courseDates")
    .doc(dateId)
    .get();

  if (!dateDoc.exists) {
    return NextResponse.json(
      { error: "Course date not found" },
      { status: 404 }
    );
  }

  const dateData = dateDoc.data() as any;
  const bookedSeats = Number(dateData.bookedSeats || 0);

  const courseDoc = await adminDb
    .collection("courses")
    .doc(dateData.courseId)
    .get();

  const courseData = courseDoc.data() as any;
  const capacity = Number(courseData.capacity || 0);

  const freeSeats = capacity - bookedSeats;

  return NextResponse.json({
    freeSeats
  });

}