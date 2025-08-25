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
  {/* Header uten TBR-tittel */}
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
