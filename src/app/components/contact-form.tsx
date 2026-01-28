"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    // 🐝 Honeypot
    if (data.get("website")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://contactapi-v2oimfcvca-ew.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email"),
            subject: data.get("subject"),
            message: data.get("message"),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setSuccess(true);
      form.reset();
    } catch (err) {
      console.error("❌ CONTACT API ERROR:", err);
      setError("Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Napište mi</CardTitle>
        <CardDescription>Ráda se vám co nejdříve ozvu</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="name" placeholder="Vaše jméno" required />
            <Input name="email" type="email" placeholder="Váš e-mail" required />
          </div>

          <Input name="subject" placeholder="Předmět" required />
          <Textarea name="message" rows={5} placeholder="Zpráva" required />

          {/* Honeypot */}
          <input
            type="text"
            name="website"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {loading && <p className="text-sm text-muted-foreground">Odesílám…</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-green-600">
              Zpráva byla úspěšně odeslána. Děkuji!
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            Odeslat zprávu
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
