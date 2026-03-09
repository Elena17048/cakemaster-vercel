import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  console.log("PAYMENT CONFIRM START");

  try {
    const data = await resend.emails.send({
      from: "CakeMaster <onboarding@resend.dev>",
      to: ["info@cakemaster.cz"],
      subject: "TEST EMAIL",
      html: "<h1>Resend test funguje</h1>",
    });

    console.log("RESEND RESPONSE:", data);

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("RESEND ERROR:", error);

    return NextResponse.json({
      success: false,
      error,
    });
  }
}