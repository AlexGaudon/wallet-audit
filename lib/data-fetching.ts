import type { Transaction } from "@/lib/definitions";
import { initPocketbaseFromCookie } from "./pb";

import { displayAmount, getFirstDayOfMonth, getLastDayOfMonth } from "./utils";

function buildFilterStringFromObject(filter: { name?: string }) {
  if (filter && filter.name) {
    return `vendor ~ "${filter?.name}"`;
  }
  return "";
}

export async function getTransactions(
  count: number,
  page: number,
  filter: {
    name?: string;
  } = {}
) {
  const pb = await initPocketbaseFromCookie();
  return await pb.collection<Transaction>("transactions").getList(page, count, {
    expand: "category",
    sort: "-date",
    filter: buildFilterStringFromObject(filter),
  });
}

export async function getCategorizedSpendingByDay(
  startDay: Date,
  days: number
) {
  const pb = await initPocketbaseFromCookie();

  const endDate = new Date(startDay.setDate(startDay.getDate() + days));

  const first = getFirstDayOfMonth(new Date());
  const last = getLastDayOfMonth(new Date());

  const transactions = await pb
    .collection<Transaction>("transactions")
    .getFullList({
      filter: `date >= "${first}" && date <= "${last}"`,
      sort: "+date",
      expand: "category",
    });

  const data: {
    name: string;
    [T: string]: string;
  }[] = [];

  for (let transaction of transactions) {
    const date = new Date(transaction.date).toISOString().split("T")[0];
    let dataElement = data.filter((x) => x.name === date);

    if (dataElement.length === 0) {
      data.push({
        name: date,
      });
    }
  }

  for (let transaction of transactions) {
    const date = new Date(transaction.date).toISOString().split("T")[0];
    let dataElement = data.filter((x) => x.name === date)[0];
    const categoryName = transaction?.expand?.category?.name ?? "Uncategorized";

    if (
      categoryName === "Income" ||
      categoryName === "Transfer" ||
      categoryName === "Investments"
    ) {
      continue;
    }

    if (dataElement[categoryName] === undefined) {
      dataElement[categoryName] = addAmount("0", Math.abs(transaction.amount));
    } else {
      dataElement[categoryName] = addAmount(
        dataElement[categoryName],
        Math.abs(transaction.amount)
      );
    }
  }

  return data;
}

function addAmount(oldAmount: string, toAdd: number): string {
  return displayAmount(Number(oldAmount) * 100 + toAdd);
}
