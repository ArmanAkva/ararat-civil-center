import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { EditModeProvider } from "@/context/EditModeContext";
import FloatingAdminBar from "@/components/cms/FloatingAdminBar";
import { SITE_URL, SITE_NAME, DEFAULT_SEO } from "@/lib/seo";
import AiTranslationBanner from "@/components/ui/AiTranslationBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SEO.title,
    template: DEFAULT_SEO.titleTemplate,
  },
  description: DEFAULT_SEO.description,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: DEFAULT_SEO.keywords,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "hy-AM": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: DEFAULT_SEO.locale,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: DEFAULT_SEO.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    creator: "@AraratForum",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Ararat Forum",
  url: SITE_URL,
  description: DEFAULT_SEO.description,
  inLanguage: "hy",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/dialogue?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  alternateName: ["Ararat Forum", "Արարատյան Կենտրոն"],
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  description: DEFAULT_SEO.description,
  sameAs: ["https://araratcivil.org"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <LanguageProvider>
            <EditModeProvider>
              <AiTranslationBanner />
              <Header />
              {children}
              <Footer />
              <FloatingAdminBar />
              <MobileBottomNav />
            </EditModeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
