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
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  // 🔥 Firestore si vytvoří vlastní ID
  const orderRef = doc(collection(db, "orders"));

  const savedOrder = {
    ...order,
    status: "new",
    createdAt: serverTimestamp(),
  };

  await setDoc(orderRef, savedOrder);

  return {
    orderId: orderRef.id,
  };
}
