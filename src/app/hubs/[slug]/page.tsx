import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CivilizationView from "@/components/CivilizationView";
import {
  civilizationsData,
  getCivilizationBySlug,
} from "@/lib/civilizationsData";

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
      title: "Քաղաքակրթություն չի գտնվել | Արարատյան Ֆորում",
    };
  }

  return {
    title: `${civ.nameHy} (${civ.nameEn}) | Արարատյան Ֆորում`,
    description: civ.credo,
    openGraph: {
      title: `${civ.nameHy} | Արարատյան Ֆորում`,
      description: civ.credo,
    },
  };
}

export default async function HubCivilizationPage({ params }: PageProps) {
  const { slug } = await params;
  const civ = getCivilizationBySlug(slug);

  if (!civ) {
    notFound();
  }

  return <CivilizationView civilization={civ} />;
}
