import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CivilizationView from "@/components/CivilizationView";
import {
  civilizationsData,
  getCivilizationBySlug,
} from "@/lib/civilizationsData";
import { getCivilizationContent } from "@/lib/contentService";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return civilizationsData.flatMap((c) => [
    { slug: c.slug },
    { slug: c.id },
  ]);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const civ = getCivilizationBySlug(slug);

  if (!civ) {
    return {
      title: "Քաղաքակրթություն չի գտնվել",
    };
  }

  const title = `${civ.nameHy} (${civ.nameEn})`;
  const description = civ.credo;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/civilizations/${civ.slug}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/civilizations/${civ.slug}`,
    },
  };
}

export default async function HubCivilizationPage({ params }: PageProps) {
  const { slug } = await params;
  const civ = getCivilizationBySlug(slug);

  if (!civ) {
    notFound();
  }

  const liveCiv = await getCivilizationContent(civ.id);

  return <CivilizationView civilization={liveCiv || civ} />;
}
