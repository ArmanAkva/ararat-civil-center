import type { Metadata } from "next";
import PublicationsCatalogView from "@/components/publications/PublicationsCatalogView";
import { getAllPublicationsWithDetails, getAllCivilizationsContent } from "@/lib/contentService";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Գիտական Աշխատությունների Գրադարան",
  description:
    "Քաղաքակրթական ռազմավարական կենտրոնների, փորձագետների և մտածողների հիմնարար աշխատություններ, վերլուծական զեկույցներ, մենագրություններ և PDF փաստաթղթեր։",
  alternates: {
    canonical: `${SITE_URL}/publications`,
  },
  openGraph: {
    title: `Գիտական Աշխատությունների Գրադարան | ${SITE_NAME}`,
    description:
      "Քաղաքակրթական ռազմավարական կենտրոնների, փորձագետների և մտածողների հիմնարար աշխատություններ, վերլուծական զեկույցներ, մենագրություններ և PDF փաստաթղթեր։",
    url: `${SITE_URL}/publications`,
  },
};

export default async function PublicationsPage() {
  const [publications, civilizations] = await Promise.all([
    getAllPublicationsWithDetails(),
    getAllCivilizationsContent(),
  ]);

  return (
    <PublicationsCatalogView
      initialPublications={publications}
      civilizations={civilizations}
    />
  );
}
