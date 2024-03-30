import { getSession, initPocketbaseFromCookie } from "@/lib/pb";
import { redirect } from "next/navigation";

import { TransactionsDisplay } from "@/components/transactions-display";
import { getAllTransactions } from "@/lib/data-fetching";
import { Category } from "@/lib/definitions";

export default async function TransactionsPage({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const pb = await initPocketbaseFromCookie();

  const pageAsNumber = Number.parseInt(params.page, 10);

  const filters: {
    name?: string;
    category?: string;
  } = {};

  if (searchParams !== undefined) {
    if ("name" in searchParams) {
      if (searchParams.name !== undefined) {
        if (Array.isArray(searchParams.name)) {
          filters.name = searchParams.name[0];
        } else {
          filters.name = searchParams.name;
        }
      }
    }

    if ("category" in searchParams) {
      if (searchParams.category !== undefined) {
        filters.category = searchParams.category as string;
      }
    }
  }

  // const transactions = await getTransactions(15, pageAsNumber, filters);
  const transactions = await getAllTransactions(filters);

  const categories = await pb.collection<Category>("categories").getFullList();

  // if (transactions.items.length === 0 && transactions.totalPages > 0) {
  //   redirect("/transactions/1");
  // }

  return (
    <main className="m-4 w-full">
      <TransactionsDisplay
        page={pageAsNumber}
        categoryFiltered={filters.category !== undefined}
        transactions={transactions}
        categories={categories}
      />
    </main>
  );
}
