import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/snippet-components/ui/provider";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talkdraft",
  description: "対話するだけで、ブログが完成する",
  keywords: ["AI", "ブログ", "自動生成", "会話", "対話"],
  verification: {
    google: `${process.env.GOOGLE_SITE_VERIFICATION}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <Provider>{children}</Provider>
        <GoogleAnalytics gaId={`${process.env.GOOGLE_ANALYTICS_ID}`} />
      </body>
    </html>
  );
}
