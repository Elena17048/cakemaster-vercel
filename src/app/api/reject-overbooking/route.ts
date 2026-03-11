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

  const courseName = courseData?.title?.cs || booking.courseId;

  await bookingRef.update({
    status: "rejected"
  });

  await resend.emails.send({
    from: "CakeMaster <info@cakemaster.cz>",
    to: [booking.email],
    subject: "Kurz je obsazen",
    html: `
      <p>Dobrý den ${booking.firstName},</p>

      <p>
      Omlouvám se, ale někdo stihnul zarezervovat poslední místo dřív
      a kurz <strong>${courseName} (${dateOnly})</strong>
      je momentálně kompletně obsazen.
      </p>

      <p>
      Prosím, dejte vědět, zda byste měla zájem o jiný termín
      nebo o vrácení peněz.
      </p>

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