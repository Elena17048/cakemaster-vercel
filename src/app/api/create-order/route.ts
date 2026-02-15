import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const docRef = await adminDb.collection("orders").add({
      ...order,
      status: "new",
      createdAt: new Date(),
    });

    return NextResponse.json({
      orderId: docRef.id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Firestore error" },
      { status: 500 }
    );
  }
}
