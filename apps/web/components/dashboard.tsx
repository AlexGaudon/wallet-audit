import {
  getCategorizedSpendingForPeriod,
  getTopSpendingThisMonth,
} from "@/lib/actions";
import { initPocketbaseFromCookie } from "@/lib/pb";
import { displayAmount } from "@/lib/utils";

export async function TopSpending() {
  const transactions = await getTopSpendingThisMonth();
  return (
    <div>
      <h1 className="font-bold text-2xl">Top Spending This Month</h1>
      {transactions.map((transaction) => (
        <h1 key={transaction.id}>
          {transaction.vendor}: ${displayAmount(transaction.amount)}
        </h1>
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
    // console.log(key, value);
  }

  return (
    <div>
      <h1 className="font-bold text-2xl">Categorized Spending This Month</h1>
      {data.map((pair) => {
        return (
          <h1 key={pair[0]}>
            {pair[0]}: ${pair[1]}
          </h1>
        );
      })}
    </div>
  );
}

export async function Dashboard() {
  const pb = await initPocketbaseFromCookie();

  return (
    <>
      <div className="grid grid-cols-2">
        <TopSpending />
        <CategorizedSpending />
      </div>
    </>
  );
}
