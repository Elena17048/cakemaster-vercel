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
    return NextResponse.json({ error: "Booking not found" });
  }

  const booking = bookingDoc.data() as any;

  const dateDoc = await adminDb
    .collection("courseDates")
    .doc(booking.dateId)
    .get();

  const courseDoc = await adminDb
    .collection("courses")
    .doc(booking.courseId)
    .get();

  const dateData = dateDoc.data() as any;
  const courseData = courseDoc.data() as any;

  const jsDate = dateData?.date?.toDate
    ? dateData.date.toDate()
    : null;

  const dateOnly = jsDate
    ? jsDate.toLocaleDateString("cs-CZ")
    : "";

  const courseName = courseData?.title?.cs || courseData?.name || booking.courseId;

  await bookingRef.update({
    status: "rejected"
  });

  await resend.emails.send({
    from: "CakeMaster <info@cakemaster.cz>",
    to: [booking.email],
    subject: "Kurz je již obsazen",
    html: `
      <p>Dobrý den ${booking.firstName},</p>

      <p>
      omlouvám se, ale poslední místo na kurzu 
      <strong>${courseName} (${dateOnly})</strong>
      bylo mezitím rezervováno a kurz je již plně obsazen.
      </p>

      <p>
      Prosím dejte mi vědět, zda byste měla zájem o jiný termín,
      případně zda preferujete vrácení platby.
      </p>

      <p>Děkuji za pochopení.</p>

      <br/>

      <p>
      S pozdravem,<br/>
      Elena<br/>
      Cake Master
      </p>
    `
  });

  return NextResponse.json({ success: true });

}