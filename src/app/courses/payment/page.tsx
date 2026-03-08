"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const amount = 2700; // cena kurzu
  const iban = "CZ6508000000192000145399"; // tvůj účet
  const vs = Date.now(); // jednoduchý variabilní symbol

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK*X-VS:${vs}`;

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl text-center">

      <h1 className="text-3xl font-bold mb-8">
        Platba za rezervaci
      </h1>

      <p className="mb-6">
        Prosíme zaplaťte kurz pomocí QR kódu.
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
        onClick={() => router.push("/courses/thank-you")}
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