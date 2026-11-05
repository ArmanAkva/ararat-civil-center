import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Քաղաքակրթական Կենտրոններ",
  description:
    "Համաշխարհային առաջատար քաղաքակրթությունների (Չինական, Հայկական, Ռուսական, Եվրոպական, Իրանական, Իսլամական, Բյուզանդական, Հնդկական) ռազմավարական կենտրոններ, ավանդույթներ և հայեցակարգեր։",
  alternates: {
    canonical: `${SITE_URL}/civilizations`,
  },
  openGraph: {
    title: `Քաղաքակրթական Կենտրոններ | ${SITE_NAME}`,
    description:
      "Համաշխարհային առաջատար քաղաքակրթությունների ռազմավարական կենտրոններ, ավանդույթներ, փիլիսոփայական հայեցակարգեր և հիմնարար աշխատություններ։",
    url: `${SITE_URL}/civilizations`,
  },
};

export default function CivilizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

