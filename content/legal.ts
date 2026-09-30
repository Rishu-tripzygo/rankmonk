// Legal copy from the design reference. Must be reviewed by counsel before launch.
// Each block is a paragraph (string) or a bullet list (string[]).

export type LegalBlock = string | string[];
export type LegalDoc = { slug: "privacy" | "terms" | "cookies"; title: string; description: string; intro: string; sections: [string, LegalBlock[]][] };

export const LEGAL_EFFECTIVE_DATE = "2026-09-29";
export const LEGAL_EFFECTIVE_LABEL = "29 September 2026";

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy", title: "Privacy Policy",
    description: "How RankMonk collects, uses and protects personal data under India's DPDP Act, 2023, your rights, and how to reach our Grievance Officer.",
    intro: "How RankMonk collects, uses and protects personal data when you visit our website, book a demo or use the RankMonk dashboard.",
    sections: [
      ["About this policy", ["This policy explains how RankMonk (\"RankMonk\", \"we\", \"us\") handles personal data when you visit rankmonk.io, book a demo or use the dashboard at dashboard.rankmonk.io (together, the \"Services\").", "We process personal data in line with the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000 and the rules made under them."]],
      ["Information we collect", ["We collect the following categories of information:", ["Contact details you give us, such as your name, work email, phone number, company name and the number of locations you manage.", "Account details, such as login credentials, user roles and billing information.", "Business data you connect to the Services, including Google Business Profile data, listings, reviews, keywords, competitors and reports.", "Usage data, such as pages visited, features used, device and browser type, IP address and approximate location.", "Communications, including emails, call notes and support requests."], "We do not ask for sensitive personal data such as health, bank account or biometric information. Reviews written by your customers may contain personal data, which we process only to provide the Services to you."]],
      ["How we use information", ["We use personal data to:", ["Provide, operate and maintain the Services", "Respond to demo requests and support queries", "Set up and manage your account, subscription and invoices", "Send service messages, such as alerts, reports and billing notices", "Send product updates and newsletters, where you have agreed to receive them", "Improve the Services, fix problems and keep them secure", "Meet legal, tax and regulatory obligations"]]],
      ["Consent and legitimate uses", ["We process personal data with your consent, or for legitimate uses permitted by law, such as providing a service you have asked for or meeting a legal obligation. Where we rely on consent, you can withdraw it at any time by writing to us. Withdrawing consent does not affect processing that took place before."]],
      ["Data from connected platforms", ["When you connect a Google Business Profile or another platform, we access only the data needed for the features you use. Our use of information received from Google APIs follows the Google API Services User Data Policy, including its Limited Use requirements. You can disconnect a platform at any time from your account settings."]],
      ["Sharing and service providers", ["We do not sell personal data. We share it only with:", ["Service providers who host our infrastructure, process payments, send email or provide analytics, under contracts that require them to protect it", "Platforms you ask us to connect to, such as Google, Bing or Apple, to publish updates on your behalf", "Government authorities, where the law requires it", "A buyer or successor, if RankMonk is part of a merger or acquisition, with notice to you"]]],
      ["Transfers outside India", ["Some service providers store or process data outside India. We transfer data only to countries not restricted by the Government of India, and we require the same level of protection wherever it is processed."]],
      ["How long we keep data", ["We keep personal data while your account is active and for as long as needed to provide the Services. After you close your account, we delete or anonymise your data within 90 days, unless we must keep it longer for legal, tax or accounting reasons."]],
      ["Security", ["We protect data with encryption in transit, access controls, regular backups and monitoring. No system is completely secure. If a personal data breach affects you, we will inform you and the Data Protection Board of India as the law requires."]],
      ["Your rights", ["Subject to applicable law, you have the right to:", ["Get a summary of the personal data we hold about you and how we use it", "Correct, complete or update inaccurate data", "Ask us to erase data we no longer need", "Withdraw consent you have given", "Nominate another person to exercise your rights in the event of death or incapacity", "Raise a grievance with us and, if it is not resolved, with the Data Protection Board of India"], "To exercise these rights, email nv@rankmonk.io. We respond within 30 days."]],
      ["Children", ["The Services are meant for businesses and are not directed at anyone under 18. We do not knowingly collect personal data from children."]],
      ["Changes to this policy", ["We may update this policy from time to time. We will post the new version on this page and, for material changes, tell account holders by email."]],
      ["Grievance Officer and contact", ["If you have a question or complaint about how we handle personal data, contact our Grievance Officer:", ["Email: nv@rankmonk.io", "Phone: +91 88717 19169", "Address: Gurugram, Haryana 122001, India"], "We acknowledge complaints within 48 hours and aim to resolve them within 30 days."]],
    ],
  },
  {
    slug: "terms", title: "Terms of Service",
    description: "The terms that govern use of the RankMonk website, dashboard and services, including subscriptions, billing in INR, acceptable use and governing law.",
    intro: "The terms that apply when you use the RankMonk website, dashboard and related services.",
    sections: [
      ["Agreement", ["These Terms of Service (\"Terms\") govern your use of the RankMonk website, dashboard and related services (the \"Services\"). By creating an account, signing an order form or using the Services, you agree to these Terms on behalf of yourself and the business you represent."]],
      ["Accounts", ["You must give accurate information when you create an account and keep it up to date. You are responsible for all activity under your account and for keeping login details secure. Tell us straight away if you suspect unauthorised access."]],
      ["Your business profiles", ["You confirm that you own, or are authorised to manage, every business profile, listing and location you connect. You authorise RankMonk to read data from, and publish changes to, those profiles on your behalf, within the permissions you grant.", "You remain responsible for the accuracy of the information you ask us to publish, and for following the policies of Google, Bing, Apple and other platforms."]],
      ["Subscriptions and billing", [["Plans are priced per location, per month, in Indian rupees. GST is charged extra at the applicable rate.", "Subscriptions renew automatically at the end of each billing period unless cancelled.", "Invoices are payable within 15 days of issue unless your order form says otherwise.", "We may suspend the Services if payment is more than 15 days overdue, after giving you notice.", "We give at least 30 days' notice of any price change, which applies from your next renewal."]]],
      ["Cancellations and refunds", ["You can cancel at any time. Cancellation takes effect at the end of the current billing period, and you keep access until then. Fees already paid are not refundable, except where the law requires it or we agree otherwise in writing."]],
      ["Acceptable use", ["You agree not to:", ["Publish false, misleading or keyword-stuffed information on business profiles", "Post fake reviews, or offer incentives for reviews against platform policies", "Manage profiles you are not authorised to manage", "Copy, scrape, reverse engineer or resell the Services without our written consent", "Interfere with the security or performance of the Services"]]],
      ["Third-party platforms", ["The Services connect to platforms we do not control, such as Google, Bing, Apple, Facebook and AI assistants. These platforms can change their features, policies or data access at any time. We are not responsible for their decisions, including ranking changes, suspensions or rejected edits."]],
      ["Rankings and results", ["Local rankings and AI answers depend on many factors outside our control. RankMonk provides data, recommendations and tools, but does not guarantee any particular rank, rating, traffic or business result."]],
      ["Your data", ["You own the data you bring to the Services. You give us a limited licence to host, process and display it only to provide and improve the Services. Our Privacy Policy explains how we handle personal data. You can export your data before your account closes."]],
      ["Intellectual property", ["RankMonk owns the Services, including the software, design, reports and documentation. Apart from the right to use the Services during your subscription, these Terms do not give you any rights in our intellectual property. If you send us feedback, we may use it without any obligation to you."]],
      ["Availability and support", ["We aim to keep the Services available at all times, apart from planned maintenance, which we announce in advance where we can. Support is available by email and phone on Indian working days."]],
      ["Suspension and termination", ["We may suspend or end your access if you materially breach these Terms and do not fix the breach within 15 days of notice, or immediately if your use puts the Services or other customers at risk. When your account ends, your right to use the Services stops and we delete your data as described in our Privacy Policy."]],
      ["Limitation of liability", ["To the extent the law allows, RankMonk is not liable for indirect, incidental or consequential losses, including lost profits, revenue or data. Our total liability for any claim is limited to the fees you paid us in the 12 months before the claim arose."]],
      ["Indemnity", ["You agree to indemnify RankMonk against claims arising from content you publish through the Services, or from your breach of these Terms or of platform policies."]],
      ["Governing law", ["These Terms are governed by the laws of India. The courts at Gurugram, Haryana have exclusive jurisdiction over any dispute arising from them."]],
      ["Changes and contact", ["We may update these Terms. We will tell account holders about material changes at least 30 days before they take effect. Send questions about these Terms to nv@rankmonk.io or call +91 88717 19169."]],
    ],
  },
  {
    slug: "cookies", title: "Cookie Policy",
    description: "Which cookies RankMonk uses on its website and dashboard, why we use them and how you can manage or block them.",
    intro: "Which cookies RankMonk uses on its website and dashboard, and how you can control them.",
    sections: [
      ["What cookies are", ["Cookies are small text files stored on your device when you visit a website. Similar technologies include local storage and pixels. In this policy we call all of them cookies."]],
      ["How we use cookies", ["We use cookies to keep the website and dashboard working, remember your preferences, understand how people use the site and measure our marketing."]],
      ["Types of cookies we use", [["Essential: needed for sign-in, security and load balancing. These cannot be switched off.", "Preferences: remember choices you make, such as the billing period on the pricing page.", "Analytics: show us which pages are visited and how the site performs, using aggregated data.", "Marketing: measure the results of our ads and campaigns. We set these only with your consent."]]],
      ["Third-party cookies", ["Some cookies are set by service providers that help us run the site, such as analytics and advertising tools. Their use of that data is governed by their own privacy policies."]],
      ["Managing cookies", ["You can accept or reject non-essential cookies when you first visit the site. You can also block or delete cookies at any time in your browser settings. Blocking essential cookies may stop parts of the site and dashboard from working."]],
      ["How long cookies last", ["Session cookies are deleted when you close your browser. Persistent cookies last between 30 days and 13 months, depending on their purpose."]],
      ["Changes and contact", ["We update this policy when we change how we use cookies. Send questions to nv@rankmonk.io."]],
    ],
  },
];

export function getLegal(slug: LegalDoc["slug"]): LegalDoc {
  return legalDocs.find((d) => d.slug === slug)!;
}
