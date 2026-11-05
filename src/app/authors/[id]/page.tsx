import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AuthorDetailView from "@/components/AuthorDetailView";
import { findAuthorById, getAllAuthorIds } from "@/lib/civilizationsData";
import { getAuthorContent } from "@/lib/contentService";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

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
      title: "Հեղինակը չի գտնվել",
    };
  }

  const { author, civ } = res;
  const title = `${author.name} (${civ.nameHy})`;
  const description =
    author.bio ||
    `${author.name} - ${author.title || "Մտածող, հետազոտող"}, ${civ.nameHy} քաղաքակրթական ուղղություն։`;
  const url = `${SITE_URL}/authors/${author.id}`;

  return {
    title,
    description,
    keywords: [
      author.name,
      author.nameOriginal || "",
      author.title || "",
      civ.nameHy,
      "Հեղինակ",
      "Մտածող",
      "Արարատյան Ֆորում",
    ].filter(Boolean),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { id } = await params;
  const live = await getAuthorContent(id);

  if (!live) {
    notFound();
  }

  const { author, civ } = live;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    alternateName: author.nameOriginal,
    jobTitle: author.title,
    description: author.bio,
    url: `${SITE_URL}/authors/${author.id}`,
    affiliation: {
      "@type": "Organization",
      name: civ.nameHy,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuthorDetailView initialAuthor={author} initialCiv={civ} />
    </>
  );
}
