import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicationDetailView from "@/components/publications/PublicationDetailView";
import { getAllPublicationIds, findPublicationById } from "@/lib/civilizationsData";
import { getPublicationContent } from "@/lib/contentService";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const ids = getAllPublicationIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const local = findPublicationById(id);

  if (!local) {
    return {
      title: "Աշխատությունը չի գտնվել | Արարատյան Կենտրոն",
    };
  }

  const { pub, civ } = local;
  return {
    title: `${pub.title} (${civ.nameHy}) | Գրադարան`,
    description: pub.description || `${pub.title} - ${civ.nameHy} քաղաքակրթական գիտական աշխատություն`,
  };
}

export default async function PublicationPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getPublicationContent(id);

  if (!item) {
    notFound();
  }

  return <PublicationDetailView initialPublication={item} />;
}
