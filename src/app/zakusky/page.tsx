import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-static";

const desserts = [
  {
    title: "Cake pops",
    slug: "cake-pops",
    image: "/images/zakusky/cake-pops/1.jpg",
    minimum: "Min. odběr 15 ks/druh",
    price: "50 Kč",
  },
  {
    title: "Dortové nanuky",
    slug: "dortove-nanuky",
    image: "/images/zakusky/dortove-nanuky/1.jpg",
    minimum: "Min. odběr 10 ks/druh",
    price: "M - 50 Kč, L - 90 Kč",
  },
  {
    title: "Cupcakes",
    slug: "cupcakes",
    image: "/images/zakusky/cupcakes/1.jpg",
    minimum: "Min. odběr 12 ks/druh",
    price: "75 Kč",
  },
  {
    title: "Pavlova",
    slug: "pavlova",
    image: "/images/zakusky/pavlova/1.jpg",
    minimum: "Min. odběr 10 ks/druh",
    price: "85 Kč",
  },
  {
    title: "Tartaletky",
    slug: "tartaletky",
    image: "/images/zakusky/tartaletky/1.jpg",
    minimum: "Min. odběr 10 ks/druh",
    price: "90 Kč",
  },
  {
    title: "Choux",
    slug: "choux",
    image: "/images/zakusky/choux/1.jpg",
    minimum: "Min. odběr 10 ks/druh",
    price: "85 Kč",
  },
  {
    title: "Skleničkové deserty",
    slug: "sklenickove-deserty",
    image: "/images/zakusky/sklenickove-deserty/1.jpg",
    minimum: "Min. odběr 15 ks/druh",
    price: "80 Kč",
  },
  {
    title: "Moussové deserty",
    slug: "moussove-deserty",
    image: "/images/zakusky/moussove-deserty/1.jpg",
    minimum: "Min. odběr 10 ks/druh",
    price: "90 Kč",
  },
  {
    title: "Makronky",
    slug: "makronky",
    image: "/images/zakusky/makronky/1.jpg",
    minimum: "Min. odběr 20 ks/druh",
    price: "S - 35 Kč, M - 55 Kč",
  },
  {
    title: "Řezy",
    slug: "rezy",
    image: "/images/zakusky/rezy/1.jpg",
    minimum: "Min. odběr 10 ks/druh",
    price: " 70 Kč",
  },
  {
    title: "Paris Brest",
    slug: "paris-brest",
    image: "/images/zakusky/paris-brest/1.jpg",
    minimum: "Min. odběr 15 ks/druh",
    price: "80 Kč",
  },
];

export default function ZakuskyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 space-y-16">

      {/* NADPIS STRÁNKY */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Zákusky & sweet bar
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
          Výběr dezertů, které mohou být součástí sweet baru nebo samostatným
          sladkým potěšením pro vaše hosty.
        </p>
      </section>

      {/* GRID ZÁKUSKŮ */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {desserts.map((item) => (
          <Link
            key={item.slug}
            href={`/zakusky/${item.slug}`}
            className="group block"
          >
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="text-center space-y-1">
  <h3 className="text-xl font-headline font-semibold">
    {item.title}
  </h3>

  <p className="text-sm text-muted-foreground">
    {item.minimum}
  </p>

  <p className="text-lg font-semibold text-primary">
    {item.price}
  </p>
</div>
            </div>
          </Link>
        ))}
      </section>

    </div>
  );
}
