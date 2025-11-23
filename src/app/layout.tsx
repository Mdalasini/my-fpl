import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Better FDR",
  description: "Fixture deficulty rating for Fantasy Premier League",
  icons: "/images/logo.svg",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
