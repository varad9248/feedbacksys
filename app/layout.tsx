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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feedback Management System",
  description: "A comprehensive feedback management system built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
