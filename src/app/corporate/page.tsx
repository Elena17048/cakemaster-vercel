import CorporateClient from "./CorporateClient";
import { getCorporatePageContent } from "@/lib/api";
import type { CorporatePageContent } from "@/lib/types";

export const revalidate = 3600;

export default async function CorporatePage() {
  const content: CorporatePageContent =
    await getCorporatePageContent();

  if (!content) {
    return null;
  }

  return <CorporateClient content={content} />;
}
