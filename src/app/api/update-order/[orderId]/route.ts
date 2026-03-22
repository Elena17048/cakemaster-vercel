import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await req.json();
    const { orderId } = params;

    const docRef = adminDb.collection("orders").doc(orderId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    await docRef.update({
      customer: body.customer,
      status: body.status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Firestore error" },
      { status: 500 }
    );
  }
}
