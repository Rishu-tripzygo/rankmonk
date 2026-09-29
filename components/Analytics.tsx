"use client";

import Script from "next/script";
import { useEffect } from "react";
import { captureUtm, track } from "@/lib/analytics";

/**
 * GA4 via gtag.js. Page views on client-side navigation are sent by GA4's
 * enhanced measurement (history changes), so no manual page_view is needed.
 * Consent mode: analytics only; ad storage stays denied (no marketing cookies).
 */
export function Analytics({ gaId }: { gaId?: string }) {
  useEffect(() => {
    captureUtm(window.location.search);

    // Delegated click tracking for CTAs, outbound, phone and email links.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const cta = a.getAttribute("data-cta");
      const href = a.getAttribute("href") || "";
      if (cta) track("cta_click", { cta_id: cta, link_url: href });
      if (href.startsWith("tel:")) track("click_to_call", { link_location: cta || window.location.pathname });
      else if (href.startsWith("mailto:")) track("click_to_email", { link_location: cta || window.location.pathname });
      else if (a.host && a.host !== window.location.host) track("outbound_click", { link_domain: a.host, link_url: a.href });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config',${JSON.stringify(gaId)},{anonymize_ip:true});`}
      </Script>
    </>
  );
}
