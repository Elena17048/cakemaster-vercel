"use client";

import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/app/components/contact-form";

export default function ContactPage() {
  const { t } = useTranslation("contact");

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 space-y-16">

      {/* NADPIS STRÁNKY – BEZE ZMĚNY TEXTŮ */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          {t("title")}
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          {t("subtitle")}
        </p>
      </section>

      {/* TELEFON + EMAIL – STEJNÉ KARTY, NOVÝ GRID */}
      <section className="grid gap-6 md:grid-cols-2">

       {/* TELEFON */}
<div className="bg-card rounded-xl p-8 shadow-sm space-y-4">
  <h3 className="text-2xl font-headline font-semibold">
    {t("telefon.title")}
  </h3>
  <p className="text-muted-foreground">
    {t("telefon.subtitle")}
  </p>

  <div className="mt-4 flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
    <Phone className="h-5 w-5 text-muted-foreground" />
    <a
      href="tel:+420774351057"
      className="text-lg font-medium hover:underline"
    >
      +420 774 351 057
    </a>
  </div>
</div>

        {/* E-MAIL */}
<div className="bg-card rounded-xl p-8 shadow-sm space-y-4">
  <h3 className="text-2xl font-headline font-semibold">
    {t("email.title")}
  </h3>
  <p className="text-muted-foreground">
    {t("email.subtitle")}
  </p>

  <div className="mt-4 flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
    <Mail className="h-5 w-5 text-muted-foreground" />
    <a
      href="mailto:objednavky@cakemaster.cz"
      className="text-lg font-medium hover:underline"
    >
      objednavky@cakemaster.cz
    </a>
  </div>
</div>

      </section>

      {/* FORMULÁŘ – CELÁ ŠÍŘKA, TEXTY BEZE ZMĚNY */}
      <section>
        <div className="bg-card rounded-xl p-10 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              {t("form.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("form.subtitle")}
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* MAPA – KARTA, STEJNÉ POPISKY */}
      <section>
        <div className="bg-card rounded-xl p-10 shadow-sm max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-headline font-semibold">
              {t("location.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("location.subtitle")}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg">
            <iframe
              src="https://www.google.com/maps?q=Na%20hut%C3%ADch%207,%20Praha&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
