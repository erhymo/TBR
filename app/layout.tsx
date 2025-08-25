import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TBR",
  description: "TBR – søk i norske finansaviser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body className="bg-blue-50 flex flex-col min-h-screen">
        {/* Stor TBR tittel med glød */}
        <header className="pt-8 pb-4 text-center text-7xl font-extrabold tracking-wide text-gray-900 drop-shadow-lg">
          TBR
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
