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
  const [courseDate, setCourseDate] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState<string | null>(null);

  useEffect(() => {

    async function loadCourseInfo() {

      const res = await fetch(`/api/course-date?dateId=${dateId}`);
      const data = await res.json();

      setFreeSeats(data.freeSeats ?? null);

      if (data.date) {
        const jsDate = data.date._seconds
          ? new Date(data.date._seconds * 1000)
          : new Date(data.date);

        setCourseDate(jsDate.toLocaleDateString("cs-CZ"));
      }

      if (data.courseTitle) {
        setCourseTitle(data.courseTitle);
      }

    }

    if (dateId) {
      loadCourseInfo();
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

      <h1 className="text-3xl font-bold mb-6">
        Rezervace kurzu
      </h1>

      {(courseTitle || courseDate) && (
        <div className="mb-8 space-y-2 text-lg">

          {courseTitle && (
            <div>
              Kurz: <span className="font-semibold">{courseTitle}</span>
            </div>
          )}

          {courseDate && (
            <div>
              Termín: <span className="font-semibold">{courseDate}</span>
            </div>
          )}

          {freeSeats !== null && freeSeats > 0 && (
            <div className="text-sm text-gray-600">
              Zbývají {freeSeats} volná místa
            </div>
          )}

        </div>
      )}

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

        <p className="text-sm text-gray-500 leading-relaxed">
          Odesláním rezervace souhlasíte s tím, že během kurzu mohou být
          pořizovány fotografie a videozáznamy, které mohou být použity
          pro marketingové účely (např. na webu nebo sociálních sítích).
        </p>

      </form>

    </div>
  );
}