"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function createOrder(order: {
  flavor: string;
  size: "two" | "three";
  shape?: string;
  cakeColor?: string;
  plaqueText?: string;
  pickupDate: string;
  note?: string;
  amount: number;
}) {
  const orderRef = adminDb.collection("orders").doc();

  await orderRef.set({
    ...order,
    status: "new",
    createdAt: FieldValue.serverTimestamp(),
  });

  return {
    orderId: orderRef.id,
  };
}
