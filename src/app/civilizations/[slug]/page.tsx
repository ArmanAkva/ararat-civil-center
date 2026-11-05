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
  const description = civ.credo || civ.overview || civ.tagline;
  const url = `${SITE_URL}/civilizations/${civ.slug}`;

  return {
    title,
    description,
    keywords: [
      civ.nameHy,
      civ.nameEn,
      civ.badge,
      "Քաղաքակրթություն",
      "Արարատյան Ֆորում",
      ...civ.centers.map((c) => c.name),
      ...civ.authors.map((a) => a.name),
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CivilizationSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const civ = getCivilizationBySlug(slug);

  if (!civ) {
    notFound();
  }

  const liveCiv = await getCivilizationContent(civ.id);
  const currentCiv = liveCiv || civ;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: `${currentCiv.nameHy} (${currentCiv.nameEn})`,
    description: currentCiv.credo || currentCiv.overview,
    url: `${SITE_URL}/civilizations/${currentCiv.slug}`,
    about: {
      "@type": "Thing",
      name: currentCiv.nameHy,
      alternateName: currentCiv.nameEn,
      description: currentCiv.tagline,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CivilizationView civilization={currentCiv} />
    </>
  );
}
