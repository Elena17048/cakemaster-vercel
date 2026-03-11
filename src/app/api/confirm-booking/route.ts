import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  const { bookingId } = await req.json();

  const bookingDoc = await adminDb
    .collection("courseBookings")
    .doc(bookingId)
    .get();

  if (!bookingDoc.exists) {
    return NextResponse.json({
      error: "Booking not found"
    });
  }

  const booking = bookingDoc.data() as any;

  await adminDb
    .collection("courseBookings")
    .doc(bookingId)
    .update({
      status: "confirmed"
    });

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