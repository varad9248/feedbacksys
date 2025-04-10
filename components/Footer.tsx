"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Copyright */}
        <div className="text-sm text-muted-foreground text-center md:text-left">
          © 2024 <span className="font-semibold">FeedForms</span>. All rights reserved.
        </div>

        {/* Right: Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/reach"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
