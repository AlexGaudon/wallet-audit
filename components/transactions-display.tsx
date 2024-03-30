"use client";
import { createKeyword, deleteTransaction } from "@/lib/actions";
import type { Category, Transaction } from "@/lib/definitions";
import { cn, displayAmount, getTextColorBasedOnBackground } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import { useDebounceValue, useWindowSize } from "usehooks-ts";

import { Paginator } from "./pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
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

  const router = useRouter();

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
            background: transaction?.expand?.category?.color,
            color: transaction?.expand?.category?.color
              ? getTextColorBasedOnBackground(
                  transaction?.expand?.category?.color
                )
              : "white",
          }}
          className={cn("text-md font-mono p-1.5 rounded", {
            "bg-red-500": categoryName === undefined,
          })}
        >
          {categoryName ? (
            <span
              onClick={() => {
                router.replace(`/transactions/1?category=${categoryName}`);
              }}
            >
              {categoryName}
            </span>
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
  categoryFiltered,
  page,
}: {
  page: number;
  transactions: Transaction[];
  categories: Category[];
  categoryFiltered?: boolean;
}) {
  const [term, setTerm] = useState("");
  const router = useRouter();

  const { height = 0 } = useWindowSize();

  const [debouncedValue] = useDebounceValue<string>(term, 300);

  const [displayTransactions, setDisplayTransactions] = useState<Transaction[]>(
    transactions.slice((page - 1) * 15, page * 15)
  );

  useEffect(() => {
    const count = Math.round(height / 55);

    console.log("start: ", (page - 1) * count);
    console.log("end: ", page * count);

    setDisplayTransactions(
      transactions.slice((page - 1) * count, page * count)
    );
  }, [height, transactions]);

  useEffect(() => {
    if (debouncedValue !== "") {
      router.replace(`/transactions/1?name=${debouncedValue}`);
    }
  }, [debouncedValue]);

  return (
    <>
      <div className="flex">
        <h1 className="font-bold text-2xl mb-2">Transactions</h1>
        <div className="flex ml-auto my-auto">
          <Paginator
            url="transactions"
            page={page}
            totalPages={Math.ceil(
              transactions.length / Math.round(height / 55)
            )}
          />
        </div>
      </div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              <Input
                type="text"
                onChange={(e) => {
                  if (e.target.value === "") {
                    router.replace("/transactions/1");
                  } else {
                    setTerm(e.target.value);
                  }
                }}
              />
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              {categoryFiltered && (
                <Button
                  onClick={() => {
                    router.replace("/transactions/1");
                  }}
                >
                  Reset
                </Button>
              )}
            </TableCell>
          </TableRow>
          {displayTransactions.map((transaction) => (
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
