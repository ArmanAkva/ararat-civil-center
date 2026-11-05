import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Արարատյան Ֆորումի Օրակարգ",
  description:
    "Արարատյան Ֆորումի տարեկան գագաթնաժողովի օրակարգը, ժամանակացույցը, առաջարկությունները, մանիֆեստը և կազմակերպչական մանրամասները։",
  alternates: {
    canonical: `${SITE_URL}/forum`,
  },
  openGraph: {
    title: `Արարատյան Ֆորումի Օրակարգ | ${SITE_NAME}`,
    description:
      "Արարատյան Ֆորումի տարեկան գագաթնաժողովի օրակարգը, ժամանակացույցը, առաջարկությունները, մանիֆեստը և կազմակերպչական մանրամասները։",
    url: `${SITE_URL}/forum`,
  },
};

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

