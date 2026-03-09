import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {

  console.log("PAYMENT CONFIRM CALLED");

  const apiKey = process.env.RESEND_API_KEY;

  console.log("API KEY EXISTS:", !!apiKey);

  if (!apiKey) {
    return NextResponse.json({
      error: "Missing RESEND_API_KEY"
    });
  }

  const resend = new Resend(apiKey);

  try {

    const { bookingId } = await req.json();

    console.log("BOOKING ID:", bookingId);

    await resend.emails.send({
      from: "CakeMaster <onboarding@resend.dev>",
      to: "info@cakemaster.cz",
      subject: "Test rezervace kurzu",
      html: `
        <h1>Test email</h1>
        <p>Booking ID: ${bookingId}</p>
      `,
    });

    console.log("EMAIL SENT");

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.error("EMAIL ERROR:", error);

    return NextResponse.json({
      error: "Email failed"
    });

  }
}