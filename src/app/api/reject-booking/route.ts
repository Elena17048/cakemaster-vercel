import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  const { bookingId } = await req.json();

  try {

    const bookingRef = adminDb.collection("courseBookings").doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ success: false });
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
        <h2>Rezervace kurzu byla zrušena</h2>

        <p>Dobrý den ${booking.firstName},</p>

        <p>
        Bohužel jsme neobdrželi platbu za rezervaci kurzu
        do 12 hodin od vytvoření rezervace.
        </p>

        <p>
        Vaše rezervace byla proto automaticky zrušena.
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