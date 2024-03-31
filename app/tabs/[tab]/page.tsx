import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tab, TabTransactions } from "@/lib/definitions";
import { initPocketbaseFromCookie } from "@/lib/pb";
import { displayAmount } from "@/lib/utils";
import { TabDetail } from "../page";

function TabTransactionList({
  transactions,
}: {
  transactions: TabTransactions[];
}) {
  return (
    <div className="w-full m-4">
      <Table>
        <TableHeader>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            return (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>${displayAmount(transaction.amount)}</TableCell>
                <TableCell>{transaction.created.toString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function TabDetailPage({
  params,
}: {
  params: { tab: string };
}) {
  const pb = await initPocketbaseFromCookie();

  const tab = await pb.collection<Tab>("tab").getOne(params.tab, {
    expand: "transactions",
  });

  console.log(tab);
  return (
    <main className="m-4 w-full">
      <TabDetail {...tab} />

      <TabTransactionList transactions={tab?.expand?.transactions} />
    </main>
  );
}
