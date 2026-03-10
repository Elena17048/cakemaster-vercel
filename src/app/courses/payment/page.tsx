"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function PaymentPage() {

  const router = useRouter();
  const [qrUrl, setQrUrl] = useState("");

  const amount = "2700.00";
  const account = "6155124013/0800";

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const bookingId = params?.get("bookingId");

  const vs = bookingId
    ? bookingId.replace(/\D/g, "").slice(0, 10)
    : Date.now().toString().slice(0, 10);

  const qrData = `SPD*1.0*ACC:${account}*AM:${amount}*CC:CZK*VS:${vs}`;

  useEffect(() => {
    QRCode.toDataURL(qrData, { width: 300 })
    .then((url: string) => setQrUrl(url));
  }, [qrData]);

  async function confirmPayment() {

    if (!bookingId) {
      router.push("/courses/thank-you");
      return;
    }

    await fetch("/api/payment-confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId,
        variableSymbol: vs
      }),
    });

    router.push("/courses/thank-you");
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl text-center">

      <h1 className="text-3xl font-bold mb-8">
        Platba za rezervaci
      </h1>

      <p className="mb-6">
        Prosím zaplaťte kurz pomocí QR kódu.
      </p>

      {qrUrl && (
        <img
          src={qrUrl}
          alt="QR platba"
          className="mx-auto mb-6"
        />
      )}

      <p className="mb-2 font-medium">
        Částka: {amount} CZK
      </p>

      <p className="mb-8 text-sm text-gray-600">
        Po zaplacení klikněte na tlačítko níže.
      </p>

      <Button
        onClick={confirmPayment}
        className="w-full"
      >
        Zaplatil jsem
      </Button>

      <p className="mt-10 text-sm text-gray-500">
        Storno: rezervaci lze zrušit nejpozději 48 hodin před kurzem.
      </p>

    </div>
  );
}