"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BookCoursePage() {

  const params = useSearchParams();

  const courseId = params.get("courseId");
  const dateId = params.get("dateId");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

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
      window.location.href = "/courses/payment";
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl">

      <h1 className="text-3xl font-bold mb-8">
        Rezervace kurzu
      </h1>

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

        <Button type="submit" className="w-full">
          Rezervovat místo
        </Button>

      </form>

    </div>
  );
}