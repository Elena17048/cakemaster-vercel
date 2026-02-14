import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const docRef = adminDb.collection("orders").doc();

    await docRef.set({
      ...order,
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      orderId: docRef.id,
    });

  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Firestore error" }, { status: 500 });
  }
}
