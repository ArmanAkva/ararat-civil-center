import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Մուտք և Գրանցում",
  description: "Արարատյան Ֆորումի մասնակցի անձնական մուտք և գրանցում։",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

