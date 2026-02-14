import { NextResponse } from "next/server";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const orderRef = doc(collection(db, "orders"));

    await setDoc(orderRef, {
      ...order,
      status: "new",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      orderId: orderRef.id,
    });

  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Firestore error" }, { status: 500 });
  }
}
