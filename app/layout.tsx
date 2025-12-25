import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Cycle Store Reviews",
  description: "Customer reviews and credit scores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Header */}
        <header className="sticky bg-white top-0 z-50 bg-card border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Logo and Title */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/logo.svg"
                  alt="Cycle Store Logo"
                  className="w-11 h-11 rounded-lg flex-shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold truncate">
                    Cycle Store Reviews
                  </h1>
                  <p className="text-xs text-muted mt-0.5">
                    Rewards for honest feedback
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                <a
                  href="/review"
                  className="px-3 py-2 text-sm font-bold text-muted hover:text-foreground hover:bg-bg-secondary rounded-lg transition-colors"
                >
                  Leave a review
                </a>
                <a
                  href="/admin"
                  className="badge px-3 py-1.5 text-sm font-bold no-underline"
                >
                  Admin
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}