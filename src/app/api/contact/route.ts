import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await db.collection("contactMessages").add({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ API CONTACT ERROR:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
