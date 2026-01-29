"use client";

import { useState } from "react";
import FlavorSelect from "./FlavorSelect";
import SizeSelect from "./SizeSelect";

export default function FastOrderPage() {
  const [flavor, setFlavor] = useState<string>("");
  const [size, setSize] = useState<"two" | "three" | null>(null);
  const [shape, setShape] = useState<
    "heart" | "round" | "star" | "square" | null
  >(null);

  return (
    <main className="w-full max-w-none">
      <FlavorSelect
        value={flavor}
        onChange={setFlavor}
      />

      <SizeSelect
        size={size}
        shape={shape}
        onSizeChange={(newSize) => {
          setSize(newSize);

          // reset tvaru při změně velikosti (UX detail)
          if (newSize === "three") {
            setShape("square");
          } else {
            setShape(null);
          }
        }}
        onShapeChange={setShape}
      />
    </main>
  );
}
