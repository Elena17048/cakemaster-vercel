import { NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const body = await req.json();

    await addDoc(collection(db, "contactMessages"), {
      name: body.name ?? "",
      email: body.email ?? "",
      subject: body.subject ?? "",
      message: body.message ?? "",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ API CONTACT ERROR:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
