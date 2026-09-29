import { LegalPage, legalMetadata } from "@/components/LegalPage";
import { getLegal } from "@/content/legal";

const doc = getLegal("terms");
export const metadata = legalMetadata(doc);

export default function TermsPage() {
  return <LegalPage doc={doc} />;
}
