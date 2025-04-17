// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/query-provider";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FeedForms | Feedback Management System",
  description:
    "Create, share, and analyze feedback forms with real-time insights. Built with Next.js and Tailwind CSS.",
  keywords: [
    "feedback forms",
    "feedback system",
    "form builder",
    "survey tool",
    "form analytics",
    "next.js feedback",
  ],
  authors: [{ name: "FeedForms Team", url: "https://feedforms.vercel.app" }],
  creator: "FeedForms Team",
  themeColor: "#ffffff",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon & Manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />

        {/* Optional: Structured Data */}
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "FeedForms",
            applicationCategory: "WebApplication",
            operatingSystem: "All",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <QueryProvider>
              <LayoutWrapper>
                <div className="relative min-h-screen flex flex-col sm:ml-2">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </LayoutWrapper>
              <Toaster />
            </QueryProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
