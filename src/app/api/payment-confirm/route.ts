import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {

    const { bookingId } = await req.json();

    const bookingDoc = await adminDb
      .collection("courseBookings")
      .doc(bookingId)
      .get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking: any = bookingDoc.data();

    const courseDoc = await adminDb
      .collection("courses")
      .doc(booking.courseId)
      .get();

    const dateDoc = await adminDb
      .collection("courseDates")
      .doc(booking.dateId)
      .get();

    const course: any = courseDoc.data();
    const date: any = dateDoc.data();

    const courseDate = date.date.toDate().toLocaleDateString("cs-CZ");

    await resend.emails.send({
      from: "CakeMaster <onboarding@resend.dev>",
      to: "info@cakemaster.cz",
      subject: "Nová rezervace kurzu",
      html: `
        <h2>Nová rezervace kurzu</h2>

        <p><strong>Kurz:</strong> ${course.title?.cs}</p>
        <p><strong>Datum:</strong> ${courseDate}</p>

        <hr/>

        <p><strong>Jméno:</strong> ${booking.firstName} ${booking.lastName}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Telefon:</strong> ${booking.phone}</p>

        <hr/>

        <p><strong>Variabilní symbol:</strong> ${bookingId}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}