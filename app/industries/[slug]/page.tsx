import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GroupPage, groupMetadata } from "@/components/GroupPage";
import { industryHref, industries } from "@/content/groups";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => industries.map((g) => ({ slug: g.slug }));

const find = (slug: string) => industries.find((g) => g.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = find((await params).slug);
  return g ? groupMetadata(g, industryHref(g.slug)) : {};
}

export default async function IndustryPage({ params }: Props) {
  const g = find((await params).slug);
  if (!g) notFound();
  return <GroupPage g={g} kind="industry" />;
}
