import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "Retouch Horse Garden｜1日4組限定の体験型ホースキャンプ",
    template: "%s｜Retouch Horse Garden",
  },
  description:
    "大阪府河内長野市。ポニーとのふれあい・餌やり・BBQを楽しめる1日4組限定のホースキャンプ場。一泊の宿泊が、引退馬たちの未来を支える活動につながります。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
