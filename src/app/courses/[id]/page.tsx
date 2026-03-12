

import { useRef } from "react";
import { adminDb } from "@/lib/firebase-admin";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

async function getCourse(id: string): Promise<any> {
  const doc = await adminDb.collection("courses").doc(id).get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  };
}

async function getDates(courseId: string): Promise<any[]> {
  const snapshot = await adminDb
    .collection("courseDates")
    .where("courseId", "==", courseId)
    .get();

  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export default async function CoursePage({ params }: any) {
  const course: any = await getCourse(params.id);
  const dates: any = await getDates(params.id);

  if (!course) {
    return <div>Kurz nenalezen</div>;
  }

  const images = course.images || [course.imageUrl];

  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <div className="container mx-auto px-4 py-16">

      {/* HERO SEKCE */}
      <div className="grid md:grid-cols-2 gap-16 mb-20 items-start">

        {/* TEXT */}
        <div>

          <h1 className="text-4xl font-bold mb-6">
            {course.title?.cs}
          </h1>

          <p className="mb-8 text-lg">
            Makronky mají pověst cukrářské černé magie. Na kurzu Vám ale ukážu,
            že s těmi správnými postupy je zvládne upéct opravdu každý.
          </p>

          <h2 className="text-xl font-semibold mb-4">
            ✨ Co Vás na kurzu čeká
          </h2>

          <ul className="space-y-2 mb-8">
            <li>– naučíte se péct, plnit, zdobit i správně skladovat makronky</li>
            <li>– ukážu Vám, jak dát „nepovedeným“ makronkám nový život</li>
            <li>– všechno si vyzkoušíte vlastníma rukama</li>
            <li>– domů si odnesete krabičku vlastnoručně vyrobených makronek</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            📂 Bonus
          </h2>

          <p className="mb-3">
            Součástí kurzu je časově neomezený přístup do Google disku, kde najdete:
          </p>

          <ul className="space-y-2 mb-6">
            <li>– kompletní recepty</li>
            <li>– podrobné postupy</li>
            <li>– videa z celého výrobního procesu</li>
          </ul>

          <p className="mb-3">
            Navíc získáte přístup do WhatsApp skupiny pro účastníky kurzu, kde:
          </p>

          <ul className="space-y-2">
            <li>– budeme sdílet fotografie z kurzu</li>
            <li>– můžete se mě kdykoliv zeptat na to, co Vás zajímá</li>
            <li>– můžete sdílet své makronkové úspěchy</li>
          </ul>

          <p className="mt-4">
            Skupina bude aktivní <strong>3 měsíce po skončení kurzu</strong>,
            poté zůstane otevřená pro čtení.
          </p>

        </div>

        {/* CAROUSEL */}
        <div className="relative">

          <Carousel
            opts={{ loop: true }}
            plugins={[autoplay.current]}
            className="w-full"
          >

            <CarouselContent>

              {images.map((img: string, index: number) => (
                <CarouselItem key={index}>

                  <div className="overflow-hidden rounded-xl">

                    <Image
                      src={img}
                      alt={`${course.title?.cs} ${index + 1}`}
                      width={1200}
                      height={900}
                      className="w-full h-[640px] object-contain"
                    />

                  </div>

                </CarouselItem>
              ))}

            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />

          </Carousel>

        </div>

      </div>

      {/* TERMÍNY */}
      <h2 className="text-2xl font-semibold mb-4">
        Dostupné termíny
      </h2>

      <div className="flex flex-wrap gap-8 mb-8 text-base">

        <div className="flex items-center gap-2">
          <span>⏱</span>
          <span>Délka kurzu: {course.duration / 60} hodiny</span>
        </div>

        <div className="flex items-center gap-2">
          <span>👥</span>
          <span>Max. {course.capacity} účastníci</span>
        </div>

        <div className="flex items-center gap-2 text-green-700 font-medium">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
          <span>Vhodné i pro začátečníky</span>
        </div>

      </div>

      <div className="space-y-4 max-w-2xl">

        {dates.map((date: any) => {

          const availableSeats =
            (course.capacity || 0) - (date.bookedSeats || 0);

          const jsDate = date.date?.toDate
            ? date.date.toDate()
            : new Date(date.date._seconds * 1000);

          return (
            <div
              key={date.id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >

              <div>

                <div className="font-medium">
                  {jsDate.toLocaleDateString("cs-CZ")}
                </div>

                <div className="text-sm text-gray-600">
                  Volná místa: {availableSeats}
                </div>

                {availableSeats === 1 && (
                  <div className="text-orange-600 text-sm font-semibold">
                    ⚠ Poslední místo
                  </div>
                )}

              </div>

              {availableSeats === 0 ? (
                <span className="text-red-600 font-semibold">
                  Kurz je plně obsazen
                </span>
              ) : (
                <Link
                  href={`/courses/book?courseId=${course.id}&dateId=${date.id}`}
                >
                  <Button>Vybrat termín</Button>
                </Link>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}