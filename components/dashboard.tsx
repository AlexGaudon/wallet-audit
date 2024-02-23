import {
  getCategorizedSpendingForPeriod,
  getTopSpendingThisMonth,
} from "@/lib/actions";
import { initPocketbaseFromCookie } from "@/lib/pb";
import { cn, displayAmount, getTextColorBasedOnBackground } from "@/lib/utils";

import { Card, CardHeader, CardContent } from "./ui/card";

export async function TopSpending({ className }: { className?: string }) {
  const transactions = await getTopSpendingThisMonth();

  return (
    <div className={className}>
      <h1 className="font-bold text-3xl text-center">
        Top Spending This Month
      </h1>
      <div className="space-y-2">
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
    </div>
  );
}

export async function CategorizedSpending({
  className,
}: {
  className?: string;
}) {
  const groups = await getCategorizedSpendingForPeriod(
    new Date().toISOString()
  );

  const rawData = [];

  for (let [key, value] of Array.from(groups.entries())) {
    rawData.push({
      category: key,
      color: value.color,
      amount: displayAmount(value.amount),
    });
  }

  const data = rawData.sort();

  return (
    <div className={className}>
      <h1 className="font-bold text-3xl text-center">Categorized Spending</h1>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {data.map((pair) => {
          const category = pair.category;
          const amount = pair.amount;
          const color = pair.color;
          return (
            <Card key={category}>
              <CardHeader>
                <p>
                  <span
                    style={{
                      background: color,
                      color: color
                        ? getTextColorBasedOnBackground(color)
                        : "white",
                    }}
                    className={cn("text-md font-mono p-1.5 rounded")}
                  >
                    {category}
                  </span>
                  <span
                    className={cn("float-right font-mono text-lg", {
                      "text-green-500": amount.at(0) !== "-",
                      "text-red-500": amount.at(0) === "-",
                    })}
                  >
                    ${amount}
                  </span>
                </p>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export async function Dashboard() {
  const pb = await initPocketbaseFromCookie();

  return (
    <>
      <div className="space-y-4">
        <CategorizedSpending className="w-full" />
        <TopSpending className="hidden md:block" />
      </div>
    </>
  );
}
