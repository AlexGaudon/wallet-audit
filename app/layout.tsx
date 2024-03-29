import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import Link from "next/link";

import { initPocketbaseFromCookie } from "@/lib/pb";
import {
  FileIcon,
  FilesIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  Table2Icon,
  TagsIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Wallet Audit",
  description: "A personal finance inspection app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pb = await initPocketbaseFromCookie();
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <nav className="min-w-64 w-64 bg-white shadow hidden md:block">
            <div className="px-8 py-4 flex">
              <div className="items-center justify-center flex">
                <img src="/favicon.ico" className="w-8 h-8" />
                <h2 className="ml-2 text-2xl font-semibold text-gray-900">
                  <Link href="/">Wallet Audit</Link>
                </h2>
              </div>
            </div>
            <div className="m-2 items-center justify-center flex">
              {!pb.authStore.isValid && (
                <>
                  <main className="space-x-2">
                    <Link
                      className="inline-flex h-8 items-center justify-center rounded-md bg-gray-100 px-3 text-xs font-medium transition-colors hover:bg-gray-100/50 focus:bg-gray-100/50 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-800/50 dark:focus:bg-gray-800/50"
                      href="/signin"
                    >
                      Sign In
                    </Link>
                    <Link
                      className="inline-flex h-8 items-center justify-center rounded-md bg-gray-100 px-3 text-xs font-medium transition-colors hover:bg-gray-100/50 focus:bg-gray-100/50 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-800/50 dark:focus:bg-gray-800/50"
                      href="/signup"
                    >
                      Sign Up
                    </Link>
                  </main>
                </>
              )}
              {pb.authStore.isValid && (
                <Link
                  className="inline-flex h-8 items-center justify-center rounded-md bg-gray-100 px-3 text-xs font-medium transition-colors hover:bg-gray-100/50 focus:bg-gray-100/50 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-800/50 dark:focus:bg-gray-800/50"
                  href="/signout"
                >
                  Sign Out
                </Link>
              )}
            </div>
            {pb.authStore.isValid && (
              <div className="mt-8">
                <ul>
                  <li>
                    <Link
                      className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-200"
                      href="/"
                    >
                      <LayoutDashboardIcon />
                      <span className="ml-3">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-200"
                      href="/insights"
                    >
                      <LineChartIcon />
                      <span className="ml-3">Insights</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-200"
                      href="/categories/1"
                    >
                      <TagsIcon />
                      <span className="ml-3">Categories</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-200"
                      href="/transactions/1"
                    >
                      <FileIcon />
                      <span className="ml-3">Transactions</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-200"
                      href="/tabs"
                    >
                      <Table2Icon />
                      <span className="ml-3">Tabs</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center px-8 py-2 text-gray-700 hover:bg-gray-200"
                      href="/import"
                    >
                      <FilesIcon />
                      <span className="ml-3">Import</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
