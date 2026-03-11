import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {

  const now = new Date();

  const snapshot = await adminDb
    .collection("courseBookings")
    .where("status", "==", "pending")
    .get();

  for (const doc of snapshot.docs) {

    const booking = doc.data() as any;

    if (!booking.createdAt) continue;

    const createdAt = booking.createdAt.toDate();

    const diffMinutes =
      (now.getTime() - createdAt.getTime()) / 1000 / 60;

    // 11h45m = 705 minut
    if (diffMinutes > 705 && diffMinutes < 720) {

      const courseDoc = await adminDb
        .collection("courses")
        .doc(booking.courseId)
        .get();

      const dateDoc = await adminDb
        .collection("courseDates")
        .doc(booking.dateId)
        .get();

      const course = courseDoc.data() as any;
      const date = dateDoc.data() as any;

      const jsDate = date?.date?.toDate
        ? date.date.toDate()
        : null;

      const dateOnly = jsDate
        ? jsDate.toLocaleDateString("cs-CZ")
        : "";

      await resend.emails.send({
        from: "CakeMaster <info@cakemaster.cz>",
        to: ["info@cakemaster.cz"],
        subject: "Platba rezervace čeká na kontrolu",
        html: `
          <p>
          Ahoj,
          </p>

          <p>
          za 15 minut vyprší rezervace kurzu
          <strong>${course.title?.cs}</strong>
          (${dateOnly}).
          </p>

          <p>
          Zkontroluj prosím, jestli nepřišla platba.
          </p>

          <p>
          Zákazník:<br/>
          ${booking.firstName} ${booking.lastName}<br/>
          ${booking.email}
          </p>
        `
      });

    }

  }

  return NextResponse.json({ success: true });

}