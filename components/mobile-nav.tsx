"use client";

import {
  FilesIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  MenuIcon,
  MenuSquareIcon,
  TagsIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MobileNavbar({ authed }: { authed: boolean }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="px-8 py-4 flex">
      <div className="grid grid-cols-2">
        <div className="items-center justify-center flex">
          <img src="/favicon.ico" className="w-8 h-8" />
          <h2 className="ml-2 text-2xl font-semibold text-gray-900">
            <Link href="/">Wallet Audit</Link>
          </h2>
        </div>
        <div className="ml-auto my-auto">
          <button
            onClick={() => {
              setVisible((val) => !val);
            }}
          >
            {!visible && <MenuIcon />}
            {visible && <MenuSquareIcon />}
          </button>
        </div>
        {visible && (
          <>
            {!authed && (
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
          </>
        )}
        {visible && authed && (
          <div className="w-full">
            <ul>
              <li>
                <Link
                  className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-200"
                  href="/"
                >
                  <LayoutDashboardIcon />
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-200"
                  href="/insights"
                >
                  <LineChartIcon />
                  <span className="ml-3">Insights</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-200"
                  href="/categories/1"
                >
                  <TagsIcon />
                  <span className="ml-3">Categories</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-200"
                  href="/transactions/1"
                >
                  <FilesIcon />
                  <span className="ml-3 overflow-auto">Transactions</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-200"
                  href="/import"
                >
                  <FilesIcon />
                  <span className="ml-3">Import</span>
                </Link>
              </li>
              <li>
                {authed && (
                  <Link
                    className="inline-flex h-8 items-center justify-center rounded-md bg-gray-100 px-3 text-xs font-medium transition-colors hover:bg-gray-100/50 focus:bg-gray-100/50 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-800/50 dark:focus:bg-gray-800/50"
                    href="/signout"
                  >
                    Sign Out
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
