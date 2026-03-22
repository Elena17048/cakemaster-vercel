"use client";

import Image from "next/image";
import { BENTO_FLAVORS } from "@/data/bento";

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export default function FlavorSelect({ value, onChange }: Props) {
  return (
    <>
      {/* TEXT – úzký sloupec, stejná osa jako ostatní sekce */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">
          Vyberte příchuť
        </h2>

        <p className="text-sm text-[#6D6D6D] mb-12">
          Příchutě není možné kombinovat ani dodatečně upravovat.
        </p>
      </div>

      {/* OBRÁZKY – široká sekce */}
      <div className="max-w-7xl mx-auto mb-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-16">
          {BENTO_FLAVORS.map((flavor) => {
            const isActive = value === flavor.id;

            return (
              <div
                key={flavor.id}
                className="flex flex-col items-center text-center"
              >
                {/* Obrázek s kontrolovanou velikostí */}
                <div className="overflow-visible">
                  <div className="transition-transform duration-300 ease-out md:hover:scale-125">
                    <Image
                      src={flavor.image}
                      alt={flavor.name}
                      width={380}
                      height={600}
                      className="object-contain w-full max-w-[260px] sm:max-w-[300px] md:max-w-[360px]"
                    />
                  </div>
                </div>

                {/* Název */}
                <div className="mt-6 text-lg font-medium">
                  {flavor.name}
                </div>

                {/* Alergeny */}
                <div className="text-sm text-[#6D6D6D] mt-2">
                  Alergeny: {flavor.allergens.join(", ")}
                </div>

                {/* Tlačítko */}
                <button
                  type="button"
                  onClick={() => onChange(flavor.id)}
                  className={`mt-6 rounded-xl px-6 py-3 text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-[#A79E6F] text-white"
                        : "bg-[#BEB58A] text-white hover:bg-[#A79E6F]"
                    }`}
                >
                  {isActive ? "Vybráno" : "Vybrat"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
