import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            flavor: { stringValue: order.flavor },
            size: { stringValue: order.size },
            shape: { stringValue: order.shape || "" },
            pickupDate: { stringValue: order.pickupDate },
            note: { stringValue: order.note || "" },
            amount: { integerValue: order.amount },
            status: { stringValue: "new" },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Firestore REST error:", data);
      return NextResponse.json({ error: "Firestore error" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: data.name.split("/").pop(),
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
