import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CenterDetailView from "@/components/CenterDetailView";
import { findCenterById, getAllCenterIds } from "@/lib/civilizationsData";
import { getCenterContent } from "@/lib/contentService";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const ids = getAllCenterIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const res = findCenterById(id);

  if (!res) {
    return {
      title: "Կենտրոնը չի գտնվել",
    };
  }

  const { center, civ } = res;
  const title = `${center.name} (${civ.nameHy})`;
  const description =
    center.description ||
    `${center.name} - ${civ.nameHy} քաղաքակրթական ռազմավարական և գիտահետազոտական կենտրոն (${center.city}, ${center.country})։`;
  const url = `${SITE_URL}/centers/${center.id}`;

  return {
    title,
    description,
    keywords: [
      center.name,
      center.originalName || "",
      civ.nameHy,
      center.city,
      center.country,
      ...(center.focusAreas || []),
      "Ռազմավարական կենտրոն",
      "Արարատյան Ֆորում",
    ].filter(Boolean),
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

export default async function CenterPage({ params }: PageProps) {
  const { id } = await params;
  const live = await getCenterContent(id);

  if (!live) {
    notFound();
  }

  const { center, civ } = live;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    name: center.name,
    alternateName: center.originalName,
    description: center.description,
    url: center.website || `${SITE_URL}/centers/${center.id}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: center.city,
      addressCountry: center.country,
    },
    parentOrganization: {
      "@type": "Organization",
      name: `${civ.nameHy} (${civ.nameEn})`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CenterDetailView initialCenter={center} initialCiv={civ} />
    </>
  );
}
