import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Քաղաքակրթական Երկխոսություն և Հարցադրումներ",
  description:
    "Հիմնարար գլոբալ հարցադրումներ, քաղաքակրթական բանավեճեր, փորձագիտական դիրքորոշումներ և ապագայի տեսլականներ։",
  alternates: {
    canonical: `${SITE_URL}/dialogue`,
  },
  openGraph: {
    title: `Քաղաքակրթական Երկխոսություն և Հարցադրումներ | ${SITE_NAME}`,
    description:
      "Հիմնարար գլոբալ հարցադրումներ, քաղաքակրթական բանավեճեր, փորձագիտական դիրքորոշումներ և ապագայի տեսլականներ։",
    url: `${SITE_URL}/dialogue`,
  },
};

export default function DialogueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

