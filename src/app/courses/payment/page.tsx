"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";

export default function PaymentPage() {

  const params = useSearchParams();
  const bookingId = params.get("bookingId");

  const [courseTitle, setCourseTitle] = useState<string | null>(null);
  const [courseDate, setCourseDate] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [variableSymbol, setVariableSymbol] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {

    async function loadBooking() {

      const res = await fetch(`/api/course-bookings?bookingId=${bookingId}`);
      const data = await res.json();

      setCourseTitle(data.courseTitle);
      setPrice(data.price);
      setVariableSymbol(data.variableSymbol);

      if (data.date) {
        const jsDate = data.date._seconds
          ? new Date(data.date._seconds * 1000)
          : new Date(data.date);

        setCourseDate(jsDate.toLocaleDateString("cs-CZ"));
      }

      // generování QR kódu
      if (data.price && data.variableSymbol) {

        const qrString =
          `SPD*1.0*ACC:CZ84080000006155124013*AM:${data.price}*CC:CZK*X-VS:${data.variableSymbol}*MSG:Cukrarske kurzy`;

        const qrUrl = await QRCode.toDataURL(qrString);

        setQrCode(qrUrl);

      }

    }

    if (bookingId) {
      loadBooking();
    }

  }, [bookingId]);
  async function confirmPayment() {

    const res = await fetch("/api/payment-confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bookingId,
        variableSymbol
      })
    });
  
    const data = await res.json();
  
    if (data.success) {
      window.location.href = "/courses/success";
    } else {
      alert("Nepodařilo se potvrdit platbu.");
    }
  
  }
  return (
    <div className="container mx-auto px-4 py-16 max-w-xl text-center">

      <h1 className="text-3xl font-bold mb-6">
        Platba za rezervaci
      </h1>

      {/* SHRUTÍ OBJEDNÁVKY */}

      {(courseTitle || courseDate) && (
        <div className="mb-10 text-left border rounded-lg p-6 bg-gray-50 space-y-2">

          {courseTitle && (
            <div>
              <span className="font-medium">Kurz:</span> {courseTitle}
            </div>
          )}

          {courseDate && (
            <div>
              <span className="font-medium">Termín:</span> {courseDate}
            </div>
          )}

          {price && (
            <div>
              <span className="font-medium">Cena:</span> {price} Kč
            </div>
          )}

        </div>
      )}

      <p className="mb-6">
        Prosím zaplaťte kurz pomocí QR kódu.
      </p>

      {/* QR */}

      <div className="flex justify-center mb-6">

        {qrCode && (
          <img
            src={qrCode}
            alt="QR platba"
            width={260}
            height={260}
          />
        )}

      </div>

      {/* ČÁSTKA + VARIABILNÍ SYMBOL */}

      {price && (
        <div className="text-lg font-medium mt-4">
          Částka: {price} Kč
        </div>
      )}

      {variableSymbol && (
        <div className="text-sm text-gray-600 mb-6">
          Variabilní symbol: <strong>{variableSymbol}</strong>
        </div>
      )}

      <p className="mb-8 text-sm text-gray-600">
        Po zaplacení klikněte na tlačítko níže.
      </p>

      <Button className="w-full mb-10">
        Zaplatil jsem
      </Button>

      {/* STORNO */}

      <div className="text-sm text-gray-600 space-y-3">

        <p>
          V případě zrušení účasti je platbu možné vrátit při odhlášení
          nejpozději <strong>5 dní před kurzem</strong>.
        </p>

        <p>
          Při pozdějším zrušení je možné za sebe najít náhradníka.
        </p>

      </div>

    </div>
  );
}