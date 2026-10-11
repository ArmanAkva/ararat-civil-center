import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AuthorDetailView from "@/components/AuthorDetailView";
import { findAuthorById, getAllAuthorIds } from "@/lib/civilizationsData";
import { getAuthorContent } from "@/lib/contentService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const ids = getAllAuthorIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const res = findAuthorById(id);

  if (!res) {
    return {
      title: "Հեղինակը չի գտնվել | Արարատյան Ֆորում",
    };
  }

  const { author, civ } = res;
  return {
    title: `${author.name} (${civ.nameHy}) | Արարատյան Ֆորում`,
    description: author.bio,
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { id } = await params;
  const live = await getAuthorContent(id);

  if (!live) {
    notFound();
  }

  return <AuthorDetailView initialAuthor={live.author} initialCiv={live.civ} />;
}
