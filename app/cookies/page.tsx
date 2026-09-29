import { LegalPage, legalMetadata } from "@/components/LegalPage";
import { getLegal } from "@/content/legal";

const doc = getLegal("cookies");
export const metadata = legalMetadata(doc);

export default function CookiesPage() {
  return <LegalPage doc={doc} />;
}
