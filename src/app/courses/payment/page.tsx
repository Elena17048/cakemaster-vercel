"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {

  const params = useSearchParams();
  const bookingId = params.get("bookingId");

  const [courseTitle, setCourseTitle] = useState<string | null>(null);
  const [courseDate, setCourseDate] = useState<string | null>(null);
  const [courseTime, setCourseTime] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {

    async function loadBooking() {

      const res = await fetch(`/api/course-booking?bookingId=${bookingId}`);
      const data = await res.json();

      setCourseTitle(data.courseTitle);
      setPrice(data.price);

      if (data.date) {
        const jsDate = data.date._seconds
          ? new Date(data.date._seconds * 1000)
          : new Date(data.date);

        setCourseDate(jsDate.toLocaleDateString("cs-CZ"));
      }

      if (data.time) {
        setCourseTime(data.time);
      }

    }

    if (bookingId) {
      loadBooking();
    }

  }, [bookingId]);

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
              {courseTime && ` • ${courseTime}`}
            </div>
          )}

          {price && (
            <div>
              <span className="font-medium">Cena:</span> {price} CZK
            </div>
          )}

        </div>
      )}

      <p className="mb-6">
        Prosím zaplaťte kurz pomocí QR kódu.
      </p>

      {/* QR */}

      <div className="flex justify-center mb-6">

        <Image
          src="/qr-payment.png"
          alt="QR platba"
          width={260}
          height={260}
        />

      </div>

      {price && (
        <div className="mb-4 text-lg">
          Částka: {price}.00 CZK
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