"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function BookCoursePage() {

  const params = useSearchParams();

  const courseId = params.get("courseId");
  const dateId = params.get("dateId");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [freeSeats, setFreeSeats] = useState<number | null>(null);

  useEffect(() => {

    async function loadSeats() {

      const res = await fetch(`/api/course-date?dateId=${dateId}`);
      const data = await res.json();

      setFreeSeats(data.freeSeats);

    }

    if (dateId) {
      loadSeats();
    }

  }, [dateId]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (freeSeats !== null && freeSeats <= 0) {
      alert("Tento termín je již plně obsazen.");
      return;
    }

    const res = await fetch("/api/course-bookings", {
      method: "POST",
      body: JSON.stringify({
        courseId,
        dateId,
        firstName,
        lastName,
        phone,
        email,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      window.location.href = `/courses/payment?bookingId=${data.bookingId}`;
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl">

      <h1 className="text-3xl font-bold mb-8">
        Rezervace kurzu
      </h1>

      {freeSeats === 0 && (
        <div className="mb-6 p-4 border rounded bg-red-50 text-red-600">
          Tento termín je již plně obsazen.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          placeholder="Jméno"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          placeholder="Příjmení"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <Button
          type="submit"
          className="w-full"
          disabled={freeSeats === 0}
        >
          Rezervovat místo
        </Button>

      </form>

    </div>
  );
}