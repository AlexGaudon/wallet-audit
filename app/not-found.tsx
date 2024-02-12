import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[50vh] py-10 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">
          404 - Page Not Found
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Oops! The page you are looking for could not be found.
        </p>
      </div>
      <Link
        className="inline-flex h-10 items-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
        href="/"
      >
        Go back to Home
      </Link>
    </div>
  );
}
