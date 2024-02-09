import { initPocketbaseFromCookie } from "@/lib/pb";
import Link from "next/link";

export async function NavBar() {
  const pb = await initPocketbaseFromCookie();

  return (
    <div className="flex items-center h-14 px-4 border-b">
      <Link className="mr-4" href="/">
        <img
          src="/favicon.ico"
          alt="The Wallet-Audit Icon"
          className="h-8 w-8"
        />
        <span className="sr-only">Wallet Audit</span>
      </Link>
      <div className="flex-1 text-center text-lg font-semibold">
        Wallet Audit
      </div>
      <div className="ml-auto flex gap-2">
        {!pb.authStore.isValid && (
          <>
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
    </div>
  );
}
