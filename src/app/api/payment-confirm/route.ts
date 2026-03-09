import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST() {

  console.log("PAYMENT CONFIRM START");

  const apiKey = process.env.RESEND_API_KEY;

  console.log("API KEY:", apiKey ? "EXISTS" : "MISSING");

  const resend = new Resend(apiKey);

  try {

    const response = await resend.emails.send({
      from: "CakeMaster <onboarding@resend.dev>",
      to: "info@cakemaster.cz",
      subject: "TEST EMAIL",
      html: "<h1>Resend test</h1>",
    });

    console.log("RESEND RESPONSE:", response);

    return NextResponse.json({
      success: true,
      response
    });

  } catch (error) {

    console.error("RESEND ERROR:", error);

    return NextResponse.json({
      error: "Email failed"
    });

  }
}