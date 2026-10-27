import type { Metadata } from "next";
import PublicationsCatalogView from "@/components/publications/PublicationsCatalogView";
import { getAllPublicationsWithDetails, getAllCivilizationsContent } from "@/lib/contentService";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Գիտական Աշխատությունների Գրադարան | Արարատյան Կենտրոն",
  description:
    "Քաղաքակրթական ռազմավարական կենտրոնների, փորձագետների և մտածողների հիմնարար աշխատություններ, վերլուծական զեկույցներ, մենագրություններ և PDF փաստաթղթեր։",
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
