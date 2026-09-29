import Image from "next/image";
import { blogCategoryStyle } from "@/content/site";

/** Post cover: the uploaded/site photo, or the category's tint panel from the design reference. */
export function BlogCover({ url, alt, category, sizes, priority }: { url: string | null; alt: string | null; category: string; sizes: string; priority?: boolean }) {
  const st = blogCategoryStyle[category] ?? blogCategoryStyle["Local SEO"];
  if (url) return <Image src={url} alt={alt ?? ""} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />;
  return (
    <span aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: st.tint, color: st.ink, fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 700, letterSpacing: "-.04em" }}>
      {st.mark}
    </span>
  );
}

export function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) : "";
}
