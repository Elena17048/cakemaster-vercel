"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentPage() {

  const router = useRouter();

  const amount = 2700;

  // správný účet pro platby kurzů
  const iban = "CZ84080000006155124013";

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const bookingId = params?.get("bookingId");

  // variabilní symbol max 10 číslic
  const vs = bookingId
    ? bookingId.replace(/\D/g, "").slice(0, 10)
    : Date.now().toString().slice(0, 10);

    const qrData = `SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK*X-VS:${vs}*MSG:Kurz`;

    const qrUrl =
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

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

      <img
        src={qrUrl}
        alt="QR platba"
        className="mx-auto mb-6"
      />

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