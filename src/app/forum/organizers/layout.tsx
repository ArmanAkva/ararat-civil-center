import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Կազմկոմիտե և Կազմակերպիչներ",
  description:
    "Արարատյան Ֆորումի կազմկոմիտեն, կազմակերպչական խումբը, ոլորտային համակարգողները և գիտական պատասխանատուները։",
  alternates: {
    canonical: `${SITE_URL}/forum/organizers`,
  },
  openGraph: {
    title: `Կազմկոմիտե և Կազմակերպիչներ | ${SITE_NAME}`,
    description:
      "Արարատյան Ֆորումի կազմկոմիտեն, կազմակերպչական խումբը, ոլորտային համակարգողները և գիտական պատասխանատուները։",
    url: `${SITE_URL}/forum/organizers`,
  },
};

export default function ForumOrganizersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

