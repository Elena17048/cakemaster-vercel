"use client";

import Image from "next/image";
import { BENTO_FLAVORS } from "@/data/bento";

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export default function FlavorSelect({ value, onChange }: Props) {
  return (
    <section className="mb-20 w-full">
      <h2 className="mb-2 text-xl font-semibold">
        Vyberte příchuť
      </h2>

      <p className="mb-8 text-sm text-[#6D6D6D]">
        Příchutě není možné kombinovat ani dodatečně upravovat.
      </p>

      {/* FULL BLEED */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-24">
        {/* GRID – MÉNĚ SLOUPCŮ = VĚTŠÍ KARTY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {BENTO_FLAVORS.map((flavor) => {
            const isActive = value === flavor.id;

            return (
              <div
                key={flavor.id}
                className={`flex flex-col rounded-2xl border transition
                  ${
                    isActive
                      ? "border-[#A79E6F]"
                      : "border-[#E2E2E2] hover:border-[#BEB58A]"
                  }`}
              >
                {/* FOTO – VELKÉ A ČITELNÉ */}
                <div className="relative w-full aspect-[2/3] rounded-t-2xl overflow-hidden bg-[#FFF9E6]">
                  <Image
                    src={flavor.image}
                    alt={flavor.name}
                    fill
                    sizes="(max-width: 640px) 100vw,
                           (max-width: 1024px) 50vw,
                           (max-width: 1280px) 33vw,
                           25vw"
                    className="object-cover"
                    priority={isActive}
                  />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col p-5">
                  <div className="mb-5 text-center text-sm text-[#6D6D6D]">
                    Alergeny: {flavor.allergens.join(", ")}
                  </div>

                  <button
                    type="button"
                    onClick={() => onChange(flavor.id)}
                    className={`mt-auto rounded-lg py-3 text-sm font-medium transition
                      ${
                        isActive
                          ? "bg-[#A79E6F] text-white"
                          : "bg-[#BEB58A] text-white hover:bg-[#B2A975]"
                      }`}
                  >
                    {isActive ? "Vybráno" : "Vybrat"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
