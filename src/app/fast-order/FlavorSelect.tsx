"use client";

import Image from "next/image";
import { BENTO_FLAVORS } from "@/data/bento";

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export default function FlavorSelect({ value, onChange }: Props) {
  return (
    <section className="mb-16">
      {/* NADPIS */}
      <h2 className="mb-2 text-xl font-semibold">
        Vyberte příchuť
      </h2>

      <p className="mb-6 text-sm text-[#6D6D6D]">
        Příchutě není možné kombinovat ani dodatečně upravovat.
      </p>

      {/* FULL WIDTH WRAPPER */}
      <div className="mx-auto max-w-none px-4 lg:px-12 xl:px-20">
        {/* GRID */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          {BENTO_FLAVORS.map((flavor) => {
            const isActive = value === flavor.id;

            return (
              <div
                key={flavor.id}
                className={`group flex w-full flex-col rounded-2xl border p-4 transition
                  ${
                    isActive
                      ? "border-[#A79E6F]"
                      : "border-[#E2E2E2] hover:border-[#BEB58A]"
                  }`}
              >
                {/* FOTO */}
                <div className="relative mb-4 w-full aspect-[3/5] overflow-hidden rounded-xl bg-[#FFF9E6]">
                  <Image
                    src={flavor.image}
                    alt={flavor.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={isActive}
                  />
                </div>

                {/* ALERGENY */}
                <div className="mb-4 text-center text-xs text-[#6D6D6D]">
                  Alergeny: {flavor.allergens.join(", ")}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => onChange(flavor.id)}
                  className={`mt-auto rounded-lg py-2.5 text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-[#A79E6F] text-white"
                        : "bg-[#BEB58A] text-white hover:bg-[#B2A975]"
                    }`}
                >
                  {isActive ? "Vybráno" : "Vybrat"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
