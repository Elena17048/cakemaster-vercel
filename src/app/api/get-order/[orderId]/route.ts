import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const doc = await adminDb
      .collection("orders")
      .doc(params.orderId)
      .get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(doc.data());
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({ error: "Firestore error" }, { status: 500 });
  }
}
