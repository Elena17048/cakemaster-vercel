"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import FlavorSelect from "./FlavorSelect";
import SizeSelect from "./SizeSelect";

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

  const [addPlaque, setAddPlaque] = useState(false);
  const [plaqueText, setPlaqueText] = useState("");

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

  const totalPrice =
    BENTO_SIZES[size].basePrice +
    (addPlaque ? PLAQUE_PRICE : 0);

  const handleSubmit = async () => {
    if (!pickupDate || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flavor,
          size,
          shape,
          pickupDate,
          note: orderNote,
          amount: totalPrice,
          plaque: addPlaque,
          plaqueText: addPlaque ? plaqueText : "",
        }),
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error("SERVER RESPONSE:", text);
        throw new Error("Server error");
      }
      
      const res = await response.json();
      
      router.push(`/fast-order/payment/${res.orderId}`);
    } catch (error) {
      console.error("ORDER ERROR:", error);
      alert("Objednávku se nepodařilo odeslat. Zkuste to prosím znovu.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-6 py-12">

      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl font-bold mb-4">
          Objednávka bento dortu
        </h1>
        <p className="text-sm text-[#6D6D6D] mb-3">
          Překvapte své blízké sladkým dárkem.
        </p>
      </div>

      <FlavorSelect value={flavor} onChange={setFlavor} />

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

     {/* ================= CEDULKA SEKCE ================= */}
<div className="max-w-3xl mx-auto mt-20">

<h2 className="text-xl font-semibold mb-2">
  Cedulka
</h2>

<p className="text-sm text-[#6D6D6D] mb-6">
  Možnost vytvoření cedulky s vlastním nadpisem.
</p>

<label className="flex items-center gap-3 cursor-pointer mb-8">
  <input
    type="checkbox"
    checked={addPlaque}
    onChange={(e) => setAddPlaque(e.target.checked)}
    className="w-4 h-4"
  />
  <span className="text-sm font-medium">
    Chci přidat cedulku (+{PLAQUE_PRICE} Kč)
  </span>
</label>

{addPlaque && (
  <div className="flex flex-col md:flex-row items-center md:items-start gap-10">

    {/* Obrázek – stejná velikost jako karty dortů */}
    <div className="bg-[#F5F0E6] border border-[#D6CFAE] rounded-2xl p-4 w-56">
      <img
        src="/images/plaque-example.jpg"
        alt="Ukázka cedulky"
        className="w-full aspect-square object-cover rounded-xl"
      />
    </div>

    {/* Text vpravo */}
    <div className="flex-1 w-full max-w-lg">
      <label className="block text-sm font-medium mb-2">
        Text na cedulku
      </label>

      <input
        type="text"
        value={plaqueText}
        onChange={(e) => setPlaqueText(e.target.value)}
        placeholder="Např. Všechno nejlepší!"
        className="w-full rounded-lg border px-4 py-3 text-sm"
      />

      <p className="text-xs text-[#6D6D6D] mt-2">
        Doporučujeme krátký text (max. 25 znaků).
      </p>
    </div>

  </div>
)}
</div>


      {/* ===== DATUM ===== */}
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

      {/* ===== KOMENTÁŘ ===== */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-xl font-semibold mb-2">
          Komentář k zakázce
        </h2>
        <textarea
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder="Např. dort bílé barvy, či bez malin nahoře"
          rows={4}
          className="w-full rounded-lg border px-4 py-3 text-sm placeholder:text-gray-400"
        />
      </div>

      {/* ===== REKAPITULACE ===== */}
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
