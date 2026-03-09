
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  const body = await req.json();

  const {
    firstName,
    lastName,
    phone,
    email,
    courseName,
    date,
    dateId,
    variableSymbol
  } = body;

  try {
    

    // EMAIL ADMINOVI
   
    const adminEmail = await resend.emails.send({
      from: "CakeMaster <info@cakemaster.cz>",
      to: ["info@cakemaster.cz"],
      subject: `Nová rezervace kurzu – ${courseName}`,
      html: `
        <h2>Nová rezervace kurzu</h2>

        <p><b>Kurz:</b> ${courseName}</p>
        <p><b>Termín:</b> ${date}</p>

        <hr/>

        <p><b>Jméno:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Telefon:</b> ${phone}</p>

        <hr/>

        <p><b>Variabilní symbol:</b> ${variableSymbol}</p>
      `
    });

    // EMAIL ZÁKAZNÍKOVI
    await resend.emails.send({
      from: "CakeMaster <info@cakemaster.cz>",
      to: [email],
      subject: "Potvrzení rezervace kurzu",
      html: `
        <h2>Děkuji za rezervaci kurzu</h2>

        <p>Vaši rezervaci jsem přijala.</p>

        <p><b>Kurz:</b> ${courseName}</p>
        <p><b>Termín:</b> ${date}</p>

        <p>
        Rezervace bude potvrzena po přijetí platby.
        Prosím vyčkejte na potvrzovací email.
        </p>

        <br/>

        <p>
        Elena<br/>
        Cake Master
        </p>
      `
    });

    return NextResponse.json({
      success: true,
      adminEmail
    });

  } catch (error) {

    console.error("EMAIL ERROR:", error);

    return NextResponse.json({
      success: false,
      error
    });

  }

}

