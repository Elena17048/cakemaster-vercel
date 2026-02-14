"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import FlavorSelect from "./FlavorSelect";
import SizeSelect from "./SizeSelect";
import { createOrder } from "./actions/createOrder";

import {
  BENTO_FLAVORS,
  BENTO_SIZES,
  PLAQUE_PRICE,
} from "@/data/bento";

type Size = "two" | "three";
type Shape = "heart" | "round" | "star" | "square";

export default function FastOrder() {
  const router = useRouter();

  const [flavor, setFlavor] = useState(BENTO_FLAVORS[0].id);
  const [size, setSize] = useState<Size>("two");
  const [shape, setShape] = useState<Shape>(
    BENTO_SIZES.two.shapes[0] as Shape
  );

  const [pickupDate, setPickupDate] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const totalPrice = BENTO_SIZES[size].basePrice;

  const handleSubmit = async () => {
    if (!pickupDate || isSubmitting) return;
  
    try {
      setIsSubmitting(true);
  
      const res = await createOrder({
        flavor,
        size,
        shape,
        pickupDate,
        note: orderNote,
        amount: totalPrice,
      });
  
      router.push(`/fast-order/payment/${res.orderId}`);
  
    } catch (error) {
      console.error("ORDER ERROR:", error);
      alert("Objednávku se nepodařilo odeslat. Zkuste to prosím znovu.");
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="w-full px-6 py-12">

      {/* ÚVOD – úzký sloupec */}
      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl font-bold mb-4">
          Objednávka bento dortu
        </h1>

        <p className="text-sm text-[#6D6D6D] mb-3">
          Překvapte své blízké sladkým dárkem.
        </p>
      </div>

      {/* PŘÍCHUTĚ – text úzký, obrázky full width */}
      <FlavorSelect value={flavor} onChange={setFlavor} />

      {/* DALŠÍ SEKCE – úzký sloupec */}
      <div className="max-w-3xl mx-auto mt-16">
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
      </div>

      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-xl font-semibold mb-2">
          Datum vyzvednutí
        </h2>

        <input
          type="date"
          value={pickupDate}
          min={getMinPickupDate()}
          onChange={(e) => setPickupDate(e.target.value)}
          className="w-full max-w-md rounded-lg border px-4 py-2"
        />
      </div>
{/* ================= KOMENTÁŘ ================= */}
<div className="max-w-3xl mx-auto mt-16">
  <h2 className="text-xl font-semibold mb-2">
    Komentář k zakázce
  </h2>

  <textarea
    value={orderNote}
    onChange={(e) => setOrderNote(e.target.value)}
    rows={4}
    className="w-full rounded-lg border px-4 py-3 text-sm"
  />
</div>
{/* ================= REKAPITULACE ================= */}
<div className="max-w-3xl mx-auto mt-16 border-t pt-6">
  <div className="text-2xl font-bold">
    Celková cena: {totalPrice} Kč
  </div>

  <button
    type="button"
    disabled={!pickupDate || isSubmitting}
    onClick={handleSubmit}
    className={`mt-8 w-full rounded-xl py-4 text-sm font-semibold transition
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
      Pro pokračování k platbě je potřeba zvolit datum vyzvednutí.
    </p>
  )}
</div>

    </div>
  );
}
