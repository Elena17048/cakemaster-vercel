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

  // zabrání dvojímu potvrzení
  if (booking.status === "confirmed") {
    return NextResponse.json({ success: true });
  }

  const dateRef = adminDb
    .collection("courseDates")
    .doc(booking.dateId);

  const courseRef = adminDb
    .collection("courses")
    .doc(booking.courseId);

  const dateDoc = await dateRef.get();
  const courseDoc = await courseRef.get();

  const dateData = dateDoc.data() as any;
  const courseData = courseDoc.data() as any;

  const capacity = Number(courseData.capacity || 0);
  const bookedSeats = Number(dateData.bookedSeats || 0);

  if (bookedSeats >= capacity) {
    return NextResponse.json(
      { error: "Course is full" },
      { status: 400 }
    );
  }

  await bookingRef.update({
    status: "confirmed"
  });

  await dateRef.update({
    bookedSeats: bookedSeats + 1
  });

  const jsDate = dateData?.date?.toDate
    ? dateData.date.toDate()
    : null;

  const dateOnly = jsDate
    ? jsDate.toLocaleDateString("cs-CZ")
    : "Neznámý termín";

  const timeOnly = jsDate
    ? jsDate.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })
    : "";

  await resend.emails.send({
    from: "CakeMaster <info@cakemaster.cz>",
    to: [booking.email],
    subject: "Rezervace potvrzena",
    html: `
      <h2 style="font-size:22px;font-weight:bold;">
        Rezervace potvrzena
      </h2>

      <p>
        Dobrý den ${booking.firstName},
      </p>

      <p>
        platba dorazila a místo na kurzu máte potvrzené.
      </p>

      <p>
        <strong>📅 Termín:</strong> ${dateOnly}<br/>
        <strong>⏰ Čas:</strong> ${timeOnly}<br/>
        <strong>📍 Místo:</strong> Na hutích 7, Praha 6
      </p>

      <p>
        🔔 Po příchodu prosím zazvoňte na zvonek „Cake Master“
      </p>

      <div style="margin:20px 0;">
        <a 
          href="https://maps.google.com/?q=Na+hutích+7,+Praha+6"
          style="
            background:#b8ab8c;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
            font-weight:bold;
          "
        >
          Otevřít navigaci
        </a>
      </div>

      <p>
        <strong>Prosím, vezměte si s sebou:</strong>
      </p>

      <p>
        – oblečení, které nebude škoda ušpinit (budeme pracovat s barvami)<br/>
        – obuv na přezutí
      </p>

      <br/>

      <p>
        Těším se na vás na kurzu.
      </p>

      <p>
        Elena<br/>
        Cake Master
      </p>
    `
  });

  return NextResponse.json({ success: true });

}