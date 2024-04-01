import type { Category, Transaction } from "@/lib/definitions";
import { initPocketbaseFromCookie } from "./pb";

import { displayAmount, getFirstDayOfMonth, getLastDayOfMonth } from "./utils";

async function buildFilterStringFromObject(filter: {
  name?: string;
  category?: string;
}) {
  if (filter && filter.name) {
    return `vendor ~ "${filter?.name}"`;
  }

  if (filter && filter.category) {
    const pb = await initPocketbaseFromCookie();
    const categories = await pb
      .collection<Category>("categories")
      .getFullList();
    const category = categories.find((x) => x.name === filter.category);

    return `category = "${category?.id}"`;
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
    filter: await buildFilterStringFromObject(filter),
  });
}

export async function getAllTransactions(
  filter: {
    name?: string;
  } = {}
) {
  const pb = await initPocketbaseFromCookie();
  return await pb.collection<Transaction>("transactions").getFullList({
    expand: "category",
    sort: "-date",
    filter: await buildFilterStringFromObject(filter),
  });
}

export async function getCategorizedSpendingByDay(startDay: Date) {
  const pb = await initPocketbaseFromCookie();

  const first = getFirstDayOfMonth(startDay);
  const last = getLastDayOfMonth(startDay);

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
