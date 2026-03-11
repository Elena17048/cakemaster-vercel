import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  const { bookingId, variableSymbol } = await req.json();

  try {

    const bookingRef = adminDb
      .collection("courseBookings")
      .doc(bookingId);

    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({
        success: false,
        error: "Booking not found"
      });
    }

    const booking = bookingDoc.data() as any;

    // pokud už je zaplaceno, nedělej nic
    if (booking.status !== "pending") {
      return NextResponse.json({ success: true });
    }

    const { firstName, lastName, email, phone, courseId, dateId } = booking;

    // TRANSAKCE - kontrola kapacity
    await adminDb.runTransaction(async (transaction) => {

      const dateRef = adminDb.collection("courseDates").doc(dateId);
      const dateDoc = await transaction.get(dateRef);

      if (!dateDoc.exists) {
        throw new Error("Course date not found");
      }

      const dateData = dateDoc.data() as any;
      const bookedSeats = dateData.bookedSeats || 0;

      const courseRef = adminDb.collection("courses").doc(courseId);
      const courseDoc = await transaction.get(courseRef);

      const courseData = courseDoc.data() as any;
      const capacity = courseData.capacity || 0;

      if (bookedSeats >= capacity) {
        throw new Error("Course is full");
      }

      transaction.update(dateRef, {
        bookedSeats: bookedSeats + 1
      });

      transaction.update(bookingRef, {
        status: "paid"
      });

    });

    // NAČTENÍ TERMÍNU
    const dateDoc = await adminDb
      .collection("courseDates")
      .doc(dateId)
      .get();

    const dateData = dateDoc.data();

    const date = dateData?.date
      ? dateData.date.toDate().toLocaleString("cs-CZ")
      : "Neznámý termín";

    // NAČTENÍ KURZU
    const courseDoc = await adminDb
      .collection("courses")
      .doc(courseId)
      .get();

    const courseData = courseDoc.data();
    const courseName = courseData?.name || courseId;

    // EMAIL ADMINOVI
    await resend.emails.send({
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

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("PAYMENT CONFIRM ERROR:", error);

    return NextResponse.json({
      success: false,
      error: "Payment confirmation failed"
    });

  }
}