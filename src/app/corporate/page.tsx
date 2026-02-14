import CorporateClient from "./CorporateClient";
import { getCorporatePageContent } from "@/lib/api";
import type { CorporatePageContent } from "@/lib/types";

export const dynamic = "force-dynamic"; // 🔥 DŮLEŽITÉ

export default async function CorporatePage() {
  try {
    const content: CorporatePageContent =
      await getCorporatePageContent();

    if (!content) {
      return null;
    }

    return <CorporateClient content={content} />;
  } catch (error) {
    console.error("Corporate page error:", error);
    return null;
  }
}
