import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GroupPage, groupMetadata } from "@/components/GroupPage";
import { solutionHref, solutions } from "@/content/groups";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => solutions.map((g) => ({ slug: g.slug }));

const find = (slug: string) => solutions.find((g) => g.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = find((await params).slug);
  return g ? groupMetadata(g, solutionHref(g.slug)) : {};
}

export default async function SolutionPage({ params }: Props) {
  const g = find((await params).slug);
  if (!g) notFound();
  return <GroupPage g={g} kind="solution" />;
}
