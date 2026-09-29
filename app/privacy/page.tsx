import { LegalPage, legalMetadata } from "@/components/LegalPage";
import { getLegal } from "@/content/legal";

const doc = getLegal("privacy");
export const metadata = legalMetadata(doc);

export default function PrivacyPage() {
  return <LegalPage doc={doc} />;
}
