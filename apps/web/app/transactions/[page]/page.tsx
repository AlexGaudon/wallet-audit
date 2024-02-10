import { getSession, initPocketbaseFromCookie } from "@/lib/pb";
import { redirect } from "next/navigation";

import { Paginator } from "@/components/pagination";
import { TransactionsDisplay } from "@/components/transactions-display";
import { Transaction } from "@/lib/definitions";

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

  const transactions = await pb
    .collection<Transaction>("transactions")
    .getList(pageAsNumber, 20, {
      expand: "category",
      sort: "-date",
    });

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
      <TransactionsDisplay transactions={transactions.items} />
    </main>
  );
}
