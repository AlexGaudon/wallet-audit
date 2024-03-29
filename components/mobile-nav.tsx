"use client";

import {
  FileIcon,
  FilesIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  MenuIcon,
  TagsIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MobileNavbar() {
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
            <MenuIcon />
          </button>
        </div>
        {visible && (
          <div>
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
                  href="/import"
                >
                  <FilesIcon />
                  <span className="ml-3">Import</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
