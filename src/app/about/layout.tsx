import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Մեր Մասին",
  description:
    "Արարատյան Ֆորումի առաքելությունը, քաղաքակրթական երկխոսության սկզբունքները, գաղափարական հիմնասյուները և նախաձեռնող խումբը։",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: `Մեր Մասին | ${SITE_NAME}`,
    description:
      "Արարատյան Ֆորումի առաքելությունը, քաղաքակրթական երկխոսության սկզբունքները, գաղափարական հիմնասյուները և նախաձեռնող խումբը։",
    url: `${SITE_URL}/about`,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

