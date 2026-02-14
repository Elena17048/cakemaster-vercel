"use server";

import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const orderRef = doc(collection(db, "orders"));

  await setDoc(orderRef, {
    ...order,
    status: "new",
    createdAt: serverTimestamp(),
  });

  return { orderId: orderRef.id };
}
