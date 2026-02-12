"use client";

export function PaymentSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">
          Platby
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          Po úvodní konzultaci a doladění všech detailů vám připravím
          kompletní cenovou nabídku na míru.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          Pro závaznou rezervaci termínu je následně potřeba uhradit{" "}
          <strong>zálohu</strong>, jejíž výše se odvíjí od celkové částky
          objednávky.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          <strong>Doplatek</strong> se hradí nejpozději{" "}
          <strong>v den svatby</strong> – a to buď{" "}
          <strong>v hotovosti</strong>, nebo{" "}
          <strong>bankovním převodem</strong> (včetně možnosti platby
          přes <strong>QR kód</strong>).
        </p>

        <p className="text-muted-foreground leading-relaxed">
          Na vaše přání vám ráda <strong>vystavím fakturu</strong>.
        </p>
      </div>
    </section>
  );
}
