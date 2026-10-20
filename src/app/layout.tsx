import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { EditModeProvider } from "@/context/EditModeContext";
import FloatingAdminBar from "@/components/cms/FloatingAdminBar";
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
  title: "Արարատյան Ֆորում",
  description: "Քաղաքակրթական Երկխոսությունների Արարատյան Ֆորում",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <EditModeProvider>
            <Header />
            {children}
            <FloatingAdminBar />
          </EditModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

