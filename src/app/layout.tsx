import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Arabic font
const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["300", "400", "500", "700", "900"],
});

// Fallback font for English
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ملخص التقنية - Arabic Tech News Summarizer",
  description: "منصة تلخيص الأخبار التقنية بالذكاء الاصطناعي للمتخصصين واصحاب القرار في العالم العربي",
  keywords: [
    "أخبار تقنية", 
    "ذكاء اصطناعي", 
    "تلخيص أخبار", 
    "تكنولوجيا", 
    "معلومات تقنية",
    "Arabic Tech News",
    "AI Summarization",
    "Technology News"
  ],
  authors: [{ name: "Arabic Tech News Summarizer Team" }],
  openGraph: {
    title: "ملخص التقنية - Arabic Tech News Summarizer",
    description: "منصة متقدمة لتلخيص الأخبار التقنية بالذكاء الاصطناعي للمتخصصين واصحاب القرار",
    url: "https://github.com/ddevaix-commits/arabic-tech-news-summarizer",
    siteName: "ملخص التقنية",
    type: "website",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ملخص التقنية - Arabic Tech News Summarizer",
    description: "منصة متقدمة لتلخيص الأخبار التقنية بالذكاء الاصطناعي",
  },
  other: {
    "twitter:label1": "اللغة",
    "twitter:data1": "العربية",
    "twitter:label2": "الفئة",
    "twitter:data2": "أخبار تقنية",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${tajawal.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen bg-background">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
