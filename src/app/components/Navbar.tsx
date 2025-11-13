"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-8">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive("/")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Table
            </Link>
            <Link
              href="/fixtures"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive("/fixtures")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Fixtures
            </Link>
            <Link
              href="/teams"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive("/teams")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Teams
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
