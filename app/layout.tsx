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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.svg" alt="Logo" width={44} height={44} style={{ borderRadius: 8 }} />
            <div>
              <div className="header-title">Cycle Store Reviews</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Rewards for honest feedback</div>
            </div>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center' }}>
            <a href="/review" style={{ marginRight: 12 }}>Leave a review</a>
            <a href="/admin" className="badge" style={{ marginRight: 12 }}>Admin</a>
            <a href="/r/scan" className="btn btn-primary">Scan & Review</a>
          </nav>
        </header>

        <main className="container" style={{ paddingTop: 24 }}>{children}</main>
      </body>
    </html>
  );
}