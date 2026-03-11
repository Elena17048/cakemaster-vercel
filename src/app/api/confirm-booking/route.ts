import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  const { bookingId } = await req.json();

  const bookingRef = adminDb
    .collection("courseBookings")
    .doc(bookingId);

  const bookingDoc = await bookingRef.get();

  if (!bookingDoc.exists) {
    return NextResponse.json({
      error: "Booking not found"
    });
  }

  const booking = bookingDoc.data() as any;

  const dateRef = adminDb
    .collection("courseDates")
    .doc(booking.dateId);

  const courseRef = adminDb
    .collection("courses")
    .doc(booking.courseId);

  try {

    await adminDb.runTransaction(async (transaction) => {

      const dateDoc = await transaction.get(dateRef);
      const courseDoc = await transaction.get(courseRef);

      if (!dateDoc.exists) {
        throw new Error("Course date not found");
      }

      if (!courseDoc.exists) {
        throw new Error("Course not found");
      }

      const dateData = dateDoc.data() as any;
      const courseData = courseDoc.data() as any;

      const capacity = Number(courseData.capacity || 0);
      const bookedSeats = Number(dateData.bookedSeats || 0);

      if (bookedSeats >= capacity) {
        throw new Error("Course is full");
      }

      transaction.update(bookingRef, {
        status: "confirmed"
      });

      transaction.update(dateRef, {
        bookedSeats: bookedSeats + 1
      });

    });

  } catch (error) {

    return NextResponse.json({
      error: "Course capacity reached"
    }, { status: 400 });

  }

  await resend.emails.send({
    from: "CakeMaster <info@cakemaster.cz>",
    to: [booking.email],
    subject: "Potvrzení rezervace kurzu",
    html: `
      <h2>Rezervace potvrzena</h2>

      <p>Dobrý den ${booking.firstName},</p>

      <p>
      Vaše rezervace kurzu byla potvrzena po přijetí platby.
      </p>

      <p>
      Těším se na vás na kurzu.
      </p>

      <br/>

      <p>
      Elena<br/>
      Cake Master
      </p>
    `
  });

  return NextResponse.json({
    success: true
  });

}