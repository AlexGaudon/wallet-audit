import {
  getCategorizedSpendingForPeriod,
  getTopSpendingThisMonth,
} from "@/lib/actions";
import { initPocketbaseFromCookie } from "@/lib/pb";
import { cn, displayAmount, getTextColorBasedOnBackground } from "@/lib/utils";

import PeriodPicker from "./period-picker";
import { Card, CardHeader } from "./ui/card";

export async function TopSpending({
  className,
  period,
}: {
  className?: string;
  period: Date;
}) {
  // TODO: this needs to actually respect a certain period and not just always be the current month.
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
                <span>({transaction.transaction_count}) </span>
                {transaction.vendor}

                <span className="float-right">
                  ${displayAmount(transaction.total_amount)}
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
  period,
}: {
  className?: string;
  period: Date;
}) {
  const groups = await getCategorizedSpendingForPeriod(period.toISOString());

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
      <div className="grid grid-cols-1 md:grid-cols-2">
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

export async function Dashboard({
  searchParams,
}: {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const pb = await initPocketbaseFromCookie();

  let period = new Date();

  if (searchParams !== undefined) {
    if ("month" in searchParams) {
      period.setMonth(Number(searchParams?.month));
    }
    if ("year" in searchParams) {
      period.setFullYear(Number(searchParams?.year));
    }
  }

  return (
    <>
      <div className="space-y-4">
        <PeriodPicker />
        <Totals period={period} />
        <div className="space-x-4 grid grid-cols-1 lg:grid-cols-2">
          <CategorizedSpending className="w-full" period={period} />
          <TopSpending className="md:block hidden" period={period} />
        </div>
      </div>
    </>
  );
}

export async function Totals({ period }: { period: Date }) {
  const data = await getCategorizedSpendingForPeriod(period.toISOString());

  const income = data.get("Income")?.amount ?? 0;

  let totalSpending = 0;

  for (const entry of Array.from(data.values())) {
    if (entry.name === "Investments") continue;
    if (entry.name === "Income") continue;
    if (entry.name === "Transfer") continue;
    totalSpending += entry.amount;
  }

  totalSpending = Math.abs(totalSpending);

  const difference = totalSpending - income;

  return (
    <div>
      <h1 className="font-bold text-3xl text-center">
        Total Income vs Expense
      </h1>
      <h1 className="text-center text-xl">
        Income: <span className="text-green-500">${displayAmount(income)}</span>
      </h1>
      <h1 className="text-center text-xl">
        Expenses:{" "}
        <span className="text-red-500">${displayAmount(totalSpending)}</span>
      </h1>
      <br />
      <h1 className="text-center text-xl">
        Total:
        <span
          className={cn({
            "text-green-500": difference < 0,
            "text-red-500": difference > 0,
          })}
        >
          ${displayAmount(Math.abs(difference))}
        </span>
      </h1>
    </div>
  );
}
