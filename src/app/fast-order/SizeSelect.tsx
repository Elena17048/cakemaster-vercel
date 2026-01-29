"use client";

import Image from "next/image";

export type Size = "two" | "three";
export type Shape = "heart" | "round" | "star" | "square";

type Props = {
  size: Size | null;
  shape: Shape | null;
  onSizeChange: (size: Size) => void;
  onShapeChange: (shape: Shape) => void;
};

export default function SizeSelect({
  size,
  shape,
  onSizeChange,
  onShapeChange,
}: Props) {
  return (
    <section className="mt-16">
      <h2 className="mb-8 text-xl font-semibold text-[#2B2B2B]">
        Vyberte velikost dortu
      </h2>

      {/* VÝBĚR VELIKOSTI */}
      <div className="mx-auto mb-12 flex max-w-4xl gap-4">
        {[
          { id: "two", label: "Pro 2 osoby", price: "800 Kč" },
          { id: "three", label: "Pro 3 osoby", price: "900 Kč" },
        ].map((item) => {
          const isActive = size === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSizeChange(item.id as Size)}
              className={`flex-1 rounded-xl border px-6 py-5 text-left transition
                ${
                  isActive
                    ? "bg-[#BEB58A] border-[#A79E6F]"
                    : "border-[#E2E2E2] hover:border-[#BEB58A]"
                }`}
            >
              <div
                className={`text-sm ${
                  isActive ? "text-white/90" : "text-[#6D6D6D]"
                }`}
              >
                {item.label}
              </div>

              <div
                className={`text-xl font-bold ${
                  isActive ? "text-white" : "text-[#2B2B2B]"
                }`}
              >
                {item.price}
              </div>
            </button>
          );
        })}
      </div>

      {/* PRO 3 OSOBY – PEVNÝ TVAR */}
      {size === "three" && (
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 text-center text-sm text-[#6D6D6D]">
            Dort pro 3 osoby má vždy čtvercový tvar
          </div>

          <div className="flex justify-center">
            <div className="flex w-full max-w-[260px] flex-col rounded-2xl border border-[#E2E2E2] bg-[#FFF9E6] p-4">
              <div className="relative h-64 w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/shapes/square.jpg"
                  alt="Čtvercový dort"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRO 2 OSOBY – VÝBĚR TVARU */}
      {size === "two" && (
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 text-center text-sm text-[#6D6D6D]">
            Vyberte si tvar dortu
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { id: "heart", label: "Srdce", img: "/images/shapes/heart.jpg" },
              { id: "round", label: "Kulatý", img: "/images/shapes/round.jpg" },
              { id: "star", label: "Hvězda", img: "/images/shapes/star.jpg" },
            ].map((item) => {
              const isActive = shape === item.id;

              return (
                <div
                  key={item.id}
                  className={`mx-auto flex w-full max-w-[260px] flex-col rounded-2xl border bg-[#FFF9E6] p-4 transition
                    ${
                      isActive
                        ? "border-[#A79E6F]"
                        : "border-[#E2E2E2] hover:border-[#BEB58A]"
                    }`}
                >
                  <div className="relative h-64 w-full overflow-hidden rounded-xl">
                    <Image
                      src={item.img}
                      alt={item.label}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onShapeChange(item.id as Shape)}
                    className={`mt-4 rounded-lg py-2.5 text-sm font-medium transition
                      ${
                        isActive
                          ? "bg-[#A79E6F] text-white"
                          : "bg-[#BEB58A] text-white hover:bg-[#B2A975]"
                      }`}
                  >
                    {item.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
