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
      <h2 className="text-xl font-semibold mb-2">
        Vyberte příchuť
      </h2>

      <p className="text-sm text-[#6D6D6D] mb-6">
        Příchutě není možné kombinovat ani dodatečně upravovat.
      </p>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {BENTO_FLAVORS.map((flavor) => {
            const isActive = value === flavor.id;

            return (
              <div
                key={flavor.id}
                className={`mx-auto flex w-full max-w-[220px] flex-col rounded-2xl border p-4 transition
                  ${
                    isActive
                      ? "border-[#A79E6F]"
                      : "border-[#E2E2E2] hover:border-[#BEB58A]"
                  }`}
              >
                <div className="relative w-full h-56 mb-4 rounded-xl bg-[#FFF9E6] flex items-center justify-center overflow-hidden">
                  <Image
                    src={flavor.image}
                    alt={flavor.name}
                    width={180}
                    height={240}
                    className="object-contain max-h-full w-auto"
                  />
                </div>

                <div className="text-xs text-[#6D6D6D] mb-4 text-center">
                  Alergeny: {flavor.allergens.join(", ")}
                </div>

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
