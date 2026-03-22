import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

import { defineSecret } from "firebase-functions/params";
import { Resend } from "resend";

// 🔥 Init Firebase Admin
initializeApp();

// 🔐 Secret
const resendApiKey = defineSecret("RESEND_API_KEY");

/* ------------------------------------------------------------------ */
/* 1️⃣ HTTP API – volá se ze statického webu                           */
/* ------------------------------------------------------------------ */
export const contactApi = onRequest(
  {
    region: "europe-west1",
    cors: true,
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      // ✅ RUČNÍ PARSING JSON (KLÍČOVÉ)
      const rawBody = req.rawBody?.toString();
      if (!rawBody) {
        res.status(400).json({ ok: false, error: "Empty body" });
        return;
      }

      const data = JSON.parse(rawBody);
      const { name, email, subject, message } = data;

      if (!name || !email || !subject || !message) {
        res.status(400).json({ ok: false, error: "Missing fields" });
        return;
      }

      await getFirestore().collection("contactMessages").add({
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
      });

      res.json({ ok: true });
    } catch (error) {
      console.error("❌ CONTACT API ERROR:", error);
      res.status(500).json({ ok: false });
    }
  }
);

/* ------------------------------------------------------------------ */
/* 2️⃣ Firestore Trigger – odešle email přes Resend                    */
/* ------------------------------------------------------------------ */
export const sendContactEmail = onDocumentCreated(
  {
    document: "contactMessages/{docId}",
    region: "europe-west1",
    secrets: [resendApiKey],
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    try {
      const resend = new Resend(resendApiKey.value());

      await resend.emails.send({
        from: "Cake Master <info@cakemaster.cz>",
        to: ["vengerka88@gmail.com"],
        replyTo: data.email,
        subject: "📩 Nová zpráva z kontaktního formuláře",
        html: `
          <h2>Nová zpráva</h2>
          <p><strong>Jméno:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Předmět:</strong> ${data.subject}</p>
          <p><strong>Zpráva:</strong><br/>${data.message}</p>
        `,
      });
    } catch (error) {
      console.error("💥 RESEND ERROR:", error);
    }
  }
);
