"use client";
import { deleteTransaction } from "@/lib/actions";
import { Transaction } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

function Transaction({ transaction }: { transaction: Transaction }) {
  const displayAmount = (transaction.amount / 100).toFixed(2);
  const categoryName = transaction.expand?.category?.name;
  return (
    <TableRow>
      <TableCell>
        <Trash2Icon
          onClick={async () => {
            if (
              confirm(`Are you sure you want to delete ${transaction.vendor}?`)
            ) {
              await deleteTransaction(transaction.id);
            }
          }}
          className="text-red-300"
        />
      </TableCell>
      <TableCell>{transaction.vendor}</TableCell>
      <TableCell>
        {new Date(transaction.date)
          .toISOString()
          .split("T")[0]
          .replaceAll("-", "/")}
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "text-md font-mono bg-primary p-1.5 rounded text-secondary",
            {
              "bg-red-500": categoryName === undefined,
            }
          )}
        >
          {categoryName ? categoryName : "Uncategorized"}
        </span>
      </TableCell>
      <TableCell>${displayAmount}</TableCell>
    </TableRow>
  );
}

export function TransactionsDisplay({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Table>
      <TableBody>
        {transactions.map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction} />
        ))}
      </TableBody>
    </Table>
  );
}
