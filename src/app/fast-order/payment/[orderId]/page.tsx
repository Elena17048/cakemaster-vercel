"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

type Order = {
  flavor: string;
  size: string;
  shape?: string;
  pickupDate: string;
  amount: number;
  status?: string;
  customer?: {
    name: string;
    phone: string;
    email: string;
  };
};

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const qrRef = useRef<HTMLCanvasElement | null>(null);

  /* ===== NAČTENÍ OBJEDNÁVKY ===== */
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await fetch(`/api/get-order/${orderId}`);

        if (!response.ok) {
          setError("Objednávka nebyla nalezena.");
          return;
        }

        const data = await response.json();
        setOrder(data);

        if (data.customer) {
          setName(data.customer.name);
          setPhone(data.customer.phone);
          setEmail(data.customer.email);
          setSaved(true);
        }
      } catch (err) {
        console.error(err);
        setError("Nepodařilo se načíst objednávku.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) loadOrder();
  }, [orderId]);

  /* ===== ULOŽENÍ KONTAKTU ===== */
  const saveContact = async () => {
    if (!name || !phone || !email) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/update-order/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name,
            phone,
            email,
          },
          status: "awaiting_payment",
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Nepodařilo se uložit údaje.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        Načítám objednávku…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center text-red-600">
        {error}
      </div>
    );
  }

  const qrValue = `
SPD*1.0
*ACC:CZ123456789/0100
*AM:${order.amount}
*CC:CZK
*X-VS:${orderId}
*MSG:Bento dort
  `;

  const downloadQR = () => {
    if (!qrRef.current) return;
    const url = qrRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-platba-bento-dort.png";
    a.click();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">
        Platba objednávky
      </h1>

      {/* ===== SHRNUTÍ ===== */}
      <section className="mb-8 text-sm">
        <div><strong>Objednávka:</strong> {orderId}</div>
        <div><strong>Příchuť:</strong> {order.flavor}</div>
        <div><strong>Velikost:</strong> {order.size}</div>
        {order.shape && (
          <div><strong>Tvar:</strong> {order.shape}</div>
        )}
        <div>
          <strong>Datum vyzvednutí:</strong> {order.pickupDate}
        </div>
        <div className="mt-2 text-lg font-bold">
          Celkem: {order.amount} Kč
        </div>
      </section>

      {/* ===== KONTAKT ===== */}
      <section className="mb-8 space-y-4">
        <input
          placeholder="Jméno a příjmení"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        />
        <input
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        />
        <input
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        />

        <button
          onClick={saveContact}
          disabled={saving || saved}
          className={`w-full rounded-xl py-3 text-sm font-semibold transition
            ${
              saved
                ? "bg-green-500 text-white"
                : "bg-[#BEB58A] text-white hover:bg-[#A79E6F]"
            }`}
        >
          {saved ? "Údaje uloženy ✓" : saving ? "Ukládám…" : "Potvrdit údaje"}
        </button>
      </section>

      {/* ===== QR ===== */}
      <section className="relative rounded-2xl border bg-[#FFF9E6] p-6 flex flex-col items-center">
        <button
          onClick={downloadQR}
          className="absolute top-3 right-3 rounded-full bg-white border p-2"
        >
          ⬇️
        </button>

        <QRCodeCanvas
          value={qrValue}
          size={220}
          bgColor="#FFF9E6"
          includeMargin
          ref={qrRef}
        />

        <div className="mt-4 text-sm text-center">
          <div><strong>Částka:</strong> {order.amount} Kč</div>
          <div><strong>VS:</strong> {orderId}</div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => router.push("/thank-you")}
        className="mt-8 w-full rounded-xl bg-[#BEB58A] py-4 text-sm font-semibold text-white hover:bg-[#A79E6F]"
      >
        Zaplatil/a jsem
      </button>

      <p className="mt-3 text-xs text-center text-muted-foreground">
        Pokud jste platbu ještě neprovedli, vraťte se prosím zpět a zaplaťte pomocí QR kódu.
      </p>
    </div>
  );
}
