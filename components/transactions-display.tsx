"use client";
import { createKeyword, deleteTransaction } from "@/lib/actions";
import { Category, Transaction } from "@/lib/definitions";
import { cn, displayAmount, getTextColorBasedOnBackground } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

function Transaction({
  transaction,
  categories,
}: {
  transaction: Transaction;
  categories: Category[];
}) {
  const categoryName = transaction.expand?.category?.name;

  const [category, setCategory] = useState("");

  console.log(transaction?.expand?.category?.color);

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
          style={{
            background: transaction.expand.category.color,
            color: getTextColorBasedOnBackground(
              transaction.expand.category.color
            ),
          }}
          className={cn("text-md font-mono p-1.5 rounded", {
            "bg-red-500": categoryName === undefined,
          })}
        >
          {categoryName ? (
            categoryName
          ) : (
            <Dialog>
              <DialogTrigger>Uncategorized</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    What category do you want to assign?
                  </DialogTitle>
                  <DialogDescription>
                    Note: This will automatically add the "{transaction.vendor}"{" "}
                    name as a keyword to that category.
                    <Select
                      value={category}
                      onValueChange={(val) => {
                        setCategory(val);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="mt-1 w-full"
                      onClick={async () => {
                        const fd = new FormData();
                        fd.set("categoryId", category);
                        fd.set("keywordName", transaction.vendor);
                        createKeyword(undefined, fd);
                      }}
                    >
                      Submit
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </span>
      </TableCell>
      <TableCell>${displayAmount(transaction.amount)}</TableCell>
    </TableRow>
  );
}

export function TransactionsDisplay({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  return (
    <>
      <Table>
        <TableBody>
          {transactions.map((transaction) => (
            <Transaction
              key={transaction.id}
              transaction={transaction}
              categories={categories}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
