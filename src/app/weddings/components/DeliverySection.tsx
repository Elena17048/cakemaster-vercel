import Image from "next/image";

export function DeliverySection() {
  return (
    <section className="py-12 md:py-16 bg-card">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid gap-10 md:gap-12 md:grid-cols-2 items-center">

          {/* OBRÁZEK */}
          <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-md md:order-1">
            <Image
              src="/images/weddings/delivery.jpg"
              alt="Přeprava svatebních dortů a dezertů"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>

          {/* TEXT */}
          <div className="space-y-6 md:order-2">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              Doprava
            </h2>

            <p className="text-muted-foreground">
              Dopravu svatebních dortů a sweet barů nabízím, vždy však v rámci
              mých časových možností. Proto je potřeba dopravu domluvit co
              nejdříve předem.
            </p>

            <div className="space-y-4">
              <div>
                <p className="font-medium">🚗 Doprava po Praze</p>
                <p className="text-muted-foreground">
                  Paušální poplatek <strong>200 Kč</strong>.
                </p>
              </div>

              <div>
                <p className="font-medium">🛣️ Doprava mimo Prahu</p>
                <p className="text-muted-foreground">
                  Účtuji <strong>9 Kč / km</strong> za cestu tam i zpět.
                </p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Samozřejmě je možné si dorty a dezerty vyzvednout osobně.
              Ráda vám k převozu předám veškeré potřebné informace a
              doporučení, aby vše dorazilo v perfektním stavu.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
