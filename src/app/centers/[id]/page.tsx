import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CenterDetailView from "@/components/CenterDetailView";
import { findCenterById, getAllCenterIds } from "@/lib/civilizationsData";
import { getCenterContent } from "@/lib/contentService";

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
      title: "Կենտրոնը չի գտնվել | Արարատյան Ֆորում",
    };
  }

  const { center, civ } = res;
  return {
    title: `${center.name} (${civ.nameHy}) | Արարատյան Ֆորում`,
    description: center.description,
  };
}

export default async function CenterPage({ params }: PageProps) {
  const { id } = await params;
  const live = await getCenterContent(id);

  if (!live) {
    notFound();
  }

  return <CenterDetailView initialCenter={live.center} initialCiv={live.civ} />;
}
