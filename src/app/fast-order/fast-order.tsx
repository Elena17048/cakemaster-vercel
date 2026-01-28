"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import FlavorSelect from "./FlavorSelect";
import SizeSelect from "./SizeSelect";
import { createOrder } from "./actions/createOrder";

import {
  BENTO_FLAVORS,
  BENTO_SIZES,
  PLAQUE_PRICE,
} from "@/data/bento";

/* ========= TYPY ========= */
type Size = "two" | "three";
type Shape = "heart" | "round" | "star" | "square";

export default function FastOrder() {
  const router = useRouter();

  /* ========= STAVY ========= */
  const [flavor, setFlavor] = useState(BENTO_FLAVORS[0].id);
  const [size, setSize] = useState<Size>("two");
  const [shape, setShape] = useState<Shape>(
    BENTO_SIZES.two.shapes[0] as Shape
  );

  const [plaqueEnabled, setPlaqueEnabled] = useState(false);
  const [plaqueText, setPlaqueText] = useState("");

  const [customColorEnabled, setCustomColorEnabled] = useState(false);
  const [cakeColor, setCakeColor] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedFlavor = BENTO_FLAVORS.find(
    (f) => f.id === flavor
  );

  /* ========= MIN. DATUM (+24h lokálně) ========= */
  const getMinPickupDate = () => {
    const now = new Date();
    const minDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    return `${minDate.getFullYear()}-${String(
      minDate.getMonth() + 1
    ).padStart(2, "0")}-${String(
      minDate.getDate()
    ).padStart(2, "0")}`;
  };

  /* ========= CENA ========= */
  const totalPrice =
  BENTO_SIZES[size].basePrice +
  (plaqueEnabled ? PLAQUE_PRICE : 0);

  /* ========= SUBMIT ========= */
  const handleSubmit = async () => {
    if (!pickupDate || isSubmitting) return;

    setIsSubmitting(true);

    const res = await createOrder({
      flavor,
      size,
      shape,
      cakeColor: customColorEnabled ? cakeColor : undefined,
      plaqueText: plaqueEnabled ? plaqueText : undefined,
      pickupDate,
      note: orderNote,
      amount: totalPrice,
    });

    router.push(`/fast-order/payment/${res.orderId}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* ================= HLAVIČKA ================= */}
      <h1 className="text-3xl font-bold mb-4">
        Objednávka bento dortu
      </h1>

      <p className="text-sm text-[#6D6D6D] max-w-xl mb-3">
        Překvapte své blízké sladkým dárkem. Moussový bento dort je malý,
        ale výrazný dezert ideální pro 2–3 osoby.
      </p>

      <p className="text-sm text-[#6D6D6D] max-w-xl mb-3">
        Všechny bento dorty mají jednotný design – jsou potaženy tenkou
        vrstvou barevné čokolády a ozdobeny čerstvým ovocem.
      </p>

      <p className="text-sm font-semibold text-[#2B2B2B] max-w-xl mb-10">
        Při objednání dnes může být připraven k vyzvednutí už zítra.
      </p>

      <FlavorSelect value={flavor} onChange={setFlavor} />

      <SizeSelect
        size={size}
        shape={shape}
        onSizeChange={(newSize) => {
          setSize(newSize);
          setShape(
            BENTO_SIZES[newSize].shapes[0] as Shape
          );
        }}
        onShapeChange={setShape}
      />

      {/* ================= DATUM ================= */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-2">
          Datum vyzvednutí
        </h2>

        <input
          type="date"
          value={pickupDate}
          min={getMinPickupDate()}
          onChange={(e) =>
            setPickupDate(e.target.value)
          }
          className="w-full max-w-md rounded-lg border px-4 py-2"
        />
      </section>

      {/* ================= KOMENTÁŘ ================= */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-2">
          Komentář k zakázce
        </h2>

        <textarea
          value={orderNote}
          onChange={(e) =>
            setOrderNote(e.target.value)
          }
          rows={4}
          className="w-full max-w-xl rounded-lg border px-4 py-3 text-sm"
        />
      </section>

      {/* ================= REKAPITULACE ================= */}
      <section className="mt-16 border-t pt-6">
        <div className="mt-6 text-2xl font-bold">
          Celková cena: {totalPrice} Kč
        </div>

        <button
          type="button"
          disabled={!pickupDate || isSubmitting}
          onClick={handleSubmit}
          className={`mt-8 w-full max-w-xl rounded-xl py-4 text-sm font-semibold transition
            ${
              pickupDate
                ? "bg-[#BEB58A] text-white hover:bg-[#A79E6F]"
                : "bg-[#E2E2E2] text-[#9A9A9A] cursor-not-allowed"
            }`}
        >
          {isSubmitting
            ? "Zpracovávám objednávku…"
            : "Pokračovat k platbě"}
        </button>

        {!pickupDate && (
          <p className="text-xs text-[#6D6D6D] mt-3">
            Pro pokračování k platbě je potřeba
            zvolit datum vyzvednutí.
          </p>
        )}
      </section>
    </div>
  );
}
