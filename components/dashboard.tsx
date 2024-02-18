import {
  getCategorizedSpendingForPeriod,
  getTopSpendingThisMonth,
} from "@/lib/actions";
import { initPocketbaseFromCookie } from "@/lib/pb";
import { cn, displayAmount } from "@/lib/utils";

import { Card, CardHeader, CardContent } from "./ui/card";

export async function TopSpending({
  className
}: {
  className?: string
}) {
  const transactions = await getTopSpendingThisMonth();

  return (
    <div className={className}>
      <h1 className="font-bold text-2xl text-center">Top Spending This Month</h1>
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardHeader className="flex">
            <p className="text-ellipsis overflow-hidden">
              {transaction.vendor}

              <span className="float-right">
                ${displayAmount(transaction.amount)}
              </span>
            </p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export async function CategorizedSpending() {
  const groups = await getCategorizedSpendingForPeriod(
    new Date().toISOString()
  );

  const data = [];

  for (let [key, value] of Array.from(groups.entries())) {
    data.push([key, displayAmount(value)]);
  }

  return (
    <div>
      <h1 className="font-bold text-2xl text-center">Categorized Spending</h1>
      {data.map((pair) => {
        const category = pair[0];
        const amount = pair[1];
        return (
          <Card key={category}>
            <CardHeader>
              <p>
              {category}
              <span className={cn('float-right', {
                'text-green-500': amount.at(0) !== '-',
                'text-red-500': amount.at(0) === '-'
              })}>
                ${amount}
              </span>
              </p>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}

export async function Dashboard() {
  const pb = await initPocketbaseFromCookie();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 pl-1">
        <TopSpending className="hidden md:block" />
        <CategorizedSpending />
      </div>
    </>
  );
}
