"use server";

import { randomUUID } from "crypto";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
  const orderId = randomUUID();

  const savedOrder = {
    ...order,
    status: "new",
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "orders", orderId), savedOrder);

  return {
    orderId,
  };
}
