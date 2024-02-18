import { getSession, initPocketbaseFromCookie } from "@/lib/pb";
import { redirect } from "next/navigation";

import { Paginator } from "@/components/pagination";
import { TransactionsDisplay } from "@/components/transactions-display";
import { Category, Transaction } from "@/lib/definitions";
import { getTransactions } from "@/lib/data-fetching";

export default async function TransactionsPage({
  params,
}: {
  params: { page: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const pb = await initPocketbaseFromCookie();

  const pageAsNumber = Number.parseInt(params.page, 10);

  const transactions = await getTransactions(25, pageAsNumber);

  const categories = await pb.collection<Category>("categories").getFullList();

  if (transactions.items.length === 0 && transactions.totalPages > 0) {
    redirect("/transactions/1");
  }

  return (
    <main className="m-4 w-full">
      <div className="flex">
        <h1 className="font-bold text-2xl mb-2">Transactions</h1>
        <div className="ml-auto">
          <Paginator
            url="transactions"
            page={pageAsNumber}
            totalPages={transactions.totalPages}
          />
        </div>
      </div>
      <TransactionsDisplay
        transactions={transactions.items}
        categories={categories}
      />
    </main>
  );
}
