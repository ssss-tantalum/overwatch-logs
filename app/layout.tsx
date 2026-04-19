import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./_components/StoreProvider";
import Nav from "./_components/Nav";
import MatchModal from "./_components/MatchModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Overwatch Logs",
  description: "OTPのための戦績記録サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-nord0 text-nord6">
        <StoreProvider>
          <Nav />
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
          <MatchModal />
        </StoreProvider>
      </body>
    </html>
  );
}
