import AddTransactionForm from "@/components/add-transaction-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tab } from "@/lib/definitions";
import { getSession, initPocketbaseFromCookie } from "@/lib/pb";
import { cn, displayAmount } from "@/lib/utils";
import Link from "next/link";

import { redirect } from "next/navigation";

export async function TabDetail(tab: Tab) {
  let balance = 0;

  if (tab?.expand?.transactions !== undefined) {
    for (let transaction of tab?.expand?.transactions) {
      if (transaction.type == "i owe") {
        balance -= transaction.amount;
      } else if (transaction.type === "i paid") {
        balance -= transaction.amount;
      } else if (transaction.type === "owes me") {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    }
  }

  return (
    <Card className="grid grid-cols-1 mt-2 drop-shadow-lg">
      <CardHeader>
        <div className="flex items-center">
          <span className="text-2xl">
            <Link href={`/tabs/${tab.id}`}>{tab.person}</Link>
          </span>
        </div>
        <div>
          Balance:{" "}
          <span
            className={cn({
              "text-green-500": balance > 0,
              "text-red-500": balance <= 0,
            })}
          >
            {" "}
            ${displayAmount(balance)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <AddTransactionForm tabId={tab.id} />
      </CardContent>
    </Card>
  );
}

export default async function Tabs() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const pb = await initPocketbaseFromCookie();

  const tabs = await pb.collection<Tab>("tab").getFullList({
    expand: "transactions",
  });

  return (
    <main className="m-4 w-full">
      <h1 className="font-bold text-2xl mb-2">Tabs</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-w-full w-full items-center justify-center lg:space-x-2">
        {tabs.map((tab) => {
          return <TabDetail key={tab.id} {...tab} />;
        })}
      </div>
    </main>
  );
}
