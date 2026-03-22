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

  await bookingRef.update({
    status: "rejected"
  });

  await resend.emails.send({
    from: "CakeMaster <info@cakemaster.cz>",
    to: [booking.email],
    subject: "Rezervace kurzu zrušena",
    html: `
      <p>Dobrý den ${booking.firstName},</p>

      <p>
      Bohužel od rezervace kurzu uběhlo 12 hodin a platba nedorazila.
      Proto jsem musela vaši rezervaci zrušit.
      </p>

      <p>
      Pokud máte o kurz stále zájem,
      můžete vytvořit novou rezervaci na webu.
      </p>

      <br/>

      <p>
      Elena<br/>
      Cake Master
      </p>
    `
  });

  return NextResponse.json({ success: true });

}