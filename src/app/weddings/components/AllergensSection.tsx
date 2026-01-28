import Image from "next/image";

export function AllergensSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-2 items-center">

          {/* TEXT */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              Alergeny
            </h2>

            <p className="text-muted-foreground">
              Vím, že na svatbě často myslíte i na hosty se speciálními
              stravovacími potřebami. Proto nabízím možnost úpravy dezertů
              a dortů tak, aby vyhovovaly nejčastějším omezením.
            </p>

            <div className="space-y-2">
              <p className="font-medium">Co zvládnu připravit</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>bezlepkové varianty</li>
                <li>bezlaktózové varianty</li>
                <li>dezerty bez ořechů</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Cena úprav</p>
              <p className="text-muted-foreground">
                V závislosti na náročnosti receptury a použitých surovin
                se u speciálních úprav účtuje příplatek{" "}
                <strong>10–30&nbsp;%</strong> z ceny dezertu či dortu.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Důležité vědět</p>
              <p className="text-muted-foreground">
                Přestože pracuji s maximální pečlivostí, výroba probíhá
                v prostředí, kde se běžně zpracovávají alergeny.
                Pokud má někdo z hostů závažnou alergii, vždy mi to prosím
                sdělte předem – společně najdeme nejlepší možné řešení.
              </p>
            </div>
          </div>

          {/* OBRÁZEK */}
          <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/images/weddings/allergens.jpg"
              alt="Bezlepkové a speciální dezerty"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
