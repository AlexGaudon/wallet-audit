"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientResponseError } from "pocketbase";
import {
  Category,
  Keyword,
  MonthlyTopSpending,
  Tab,
  TabTransactions,
  Transaction,
} from "./definitions";
import { getSession, initPocketbaseFromCookie } from "./pb";
import { getFirstDayOfMonth, getLastDayOfMonth } from "./utils";

const hexColors = [
  "#3498db",
  "#2ecc71",
  "#e74c3c",
  "#f39c12",
  "#1abc9c",
  "#27ae60",
  "#c0392b",
  "#2980b9",
  "#d35400",
  "#8e44ad",
  "#16a085",
  "#7f8c8d",
  "#f1c40f",
  "#34495e",
  "#95a5a6",
  "#e82c0c",
  "#136a8a",
  "#7f7f7f",
  "#8c564b",
  "#d62728",
  "#e377c2",
  "#bcbd22",
  "#17becf",
  "#aec7e8",
  "#2ca02c",
  "#98df8a",
  "#9467bd",
  "#c5b0d5",
  "#c49c94",
  "#ffbb78",
];

export async function getCategorizedSpendingForPeriod(period: string) {
  const pb = await initPocketbaseFromCookie();

  const periodDate = new Date(period);

  const first = getFirstDayOfMonth(periodDate);
  const last = getLastDayOfMonth(periodDate);

  const transactions = await pb
    .collection<Transaction>("transactions")
    .getFullList({
      filter: `date >= "${first}" && date <= "${last}"`,
      sort: "+date",
      expand: "category",
    });

  const grouped = new Map<
    string,
    {
      name: string;
      amount: number;
      color: string;
    }
  >();

  for (let transaction of transactions) {
    if (!transaction.expand?.category?.name) {
      continue;
    }
    const cName = transaction.expand.category.name;

    if (!grouped.get(cName)) {
      grouped.set(cName, {
        name: cName,
        amount: 0,
        color: transaction.expand.category.color,
      });
    }

    const val = grouped.get(cName)!;
    grouped.set(cName, {
      ...val,
      amount: val.amount + transaction.amount,
      name: cName,
    });
  }

  return grouped;
}

export async function getTopSpendingThisMonth() {
  const pb = await initPocketbaseFromCookie();

  const transactions = await pb
    .collection<MonthlyTopSpending>("monthly_spending_by_vendor")
    .getFullList();

  return transactions;
}

export async function deleteTransaction(transactionId: string) {
  const pb = await initPocketbaseFromCookie();

  await pb.collection("transactions").delete(transactionId);

  revalidatePath("/transactions");
}

export async function deleteCategory(categoryId: string) {
  const pb = await initPocketbaseFromCookie();

  await pb.collection("categories").delete(categoryId);

  revalidatePath("/categories");
}

export async function createTabTransaction(
  prevState: string | undefined,
  formData: FormData
) {
  const tabId = formData.get("tabId");
  const amount = formData.get("amount");
  const type = formData.get("type");

  if (type === "") {
    return "failed: invalid type";
  }

  if (amount?.toString().length === 0) {
    return "failed: amount cannot be 0";
  }

  const pb = await initPocketbaseFromCookie();

  const session = await getSession();

  try {
    const transactionResult = await pb
      .collection<TabTransactions>("tab_transactions")
      .create({
        user: session?.id,
        tab: tabId,
        amount: (amount as unknown as number) * 100,
        type,
      });

    await pb.collection<Tab>("tab").update(tabId as string, {
      "transactions+": transactionResult.id,
    });

    revalidatePath("/tabs");
  } catch (error) {
    console.error(error);
  }

  return "ok";
}

export async function createKeyword(
  prevState: string | undefined,
  formData: FormData
) {
  const categoryId = formData.get("categoryId");
  const keyword = formData.get("keywordName");

  const pb = await initPocketbaseFromCookie();
  const session = await getSession();
  let assignResult;
  try {
    const keywordResult = await pb.collection<Keyword>("keywords").create({
      user: session?.id,
      category: categoryId,
      keyword,
    });

    assignResult = await pb
      .collection<Category>("categories")
      .update(categoryId as string, {
        "keywords+": keywordResult.id,
      });

    revalidatePath("/categories");
  } catch (e) {
    console.error(e);
    return "Error creating keyword";
  }
  try {
    const transactions = await pb
      .collection<Transaction>("transactions")
      .getFullList({
        filter: `vendor="${keyword}" && user="${session?.id}"`,
      });

    for (let transaction of transactions) {
      await pb.collection("transactions").update(transaction.id, {
        category: assignResult?.id,
      });
    }
  } catch (e) {
    return "Error assigning category to transactions.";
  }

  return "ok";
}

async function getUnusedColor() {
  const pb = await initPocketbaseFromCookie();
  const categories = await pb.collection<Category>("categories").getFullList();
  let colors = [...hexColors];

  for (let category of categories) {
    if (colors.includes(category.color)) {
      colors = colors.slice(colors.indexOf(category.color), 1);
    }
  }

  return colors[Math.round(Math.random() * colors.length)];
}

export async function createCategory(
  prevState: string | undefined,
  formData: FormData
) {
  const name = formData.get("categoryName");

  const pb = await initPocketbaseFromCookie();

  const session = await getSession();
  const color = await getUnusedColor();

  try {
    const res = await pb.collection<Category>("categories").create({
      name,
      user: session?.id,
      color: await getUnusedColor(),
    });
    revalidatePath("/categories/");
    return res.id;
  } catch (e) {
    console.log(e);
    return `failed ${name}`;
  }
}

export async function signIn(
  prevState: string | undefined,
  formData: FormData
) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email == null || password == null) {
    return "fields";
  }

  try {
    const pb = await initPocketbaseFromCookie();
    await pb
      .collection("users")
      .authWithPassword(email as string, password as string);

    if (pb.authStore.isValid) {
      cookies().set("pb_auth", pb.authStore.exportToCookie());
    }

    return "ok";
  } catch (e) {
    console.error(e);
    return "AuthError";
  }
}

export async function signUp(
  prevState: string | undefined,
  formData: FormData
) {
  const pb = await initPocketbaseFromCookie();

  const name = formData.get("displayName");
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    await pb.collection("users").create({
      email: email,
      password: password,
      passwordConfirm: password,
      name: name,
    });
    return "ok";
  } catch (e) {
    const error = e as Error;
    console.error(e);
    return "A user with this email already exists.";
  }
}

export async function signOut() {
  const pb = await initPocketbaseFromCookie();

  pb.authStore.clear();
  cookies().delete("pb_auth");

  redirect("/signin");
}

export async function importTransactions(data: string) {
  const session = await getSession();

  if (!session) {
    return "Unauthorized";
  }

  let statements = data.split("<STMTTRN>");

  let transactions: string[] = [];

  const transactionData: ImportTransaction[] = [];

  type ImportTransaction = {
    DTPOSTED: string;
    TRNAMT: string;
    FITID: string;
    NAME: string;
  };

  for (let i = 1; i < statements.length; i++) {
    const stmt = statements[i];

    const parts = stmt.split("</STMTTRN");
    if (parts.length > 1) {
      transactions.push(parts[0].replaceAll("\n", ""));
    }
  }

  for (let line of transactions) {
    let parts = line.split("<").filter((x) => x.trim() !== "");
    let temp: any = {};
    for (let part of parts) {
      let split = part.split(">");
      if (split[0] === "DTPOSTED") {
        let date = split[1].substring(0, 8).split("");
        date.splice(4, 0, "-");
        date.splice(7, 0, "-");
        temp[split[0]] = date.join("");
      } else {
        temp[split[0]] = split[1];
      }
    }

    if (temp satisfies ImportTransaction) {
      transactionData.push(temp);
    }
  }

  const pb = await initPocketbaseFromCookie();

  for (let td of transactionData) {
    const newTransaction = {
      user: session.id,
      category: "",
      amount: Number(td.TRNAMT) * 100,
      vendor: td.NAME,
      date: new Date(td.DTPOSTED),
      externalId: td.FITID,
    };
    try {
      const category = await getCategoryFromVendorName(newTransaction.vendor);
      if (category !== undefined) {
        newTransaction.category = category;
      }
      await pb.collection("transactions").create(newTransaction);
    } catch (e) {
      const error = e as ClientResponseError;
      console.error(JSON.stringify(error));
    }
  }

  revalidatePath("/transactions");
}

export async function getCategoryFromVendorName(vendorName: string) {
  const session = await getSession();

  if (!session) {
    return "Unauthorized";
  }

  const pb = await initPocketbaseFromCookie();
  try {
    const keywords = await pb
      .collection<Keyword>("keywords")
      .getFirstListItem(`keyword="${vendorName}" && user="${session?.id}"`);

    if (keywords?.category !== undefined) {
      return keywords.category;
    }
  } catch (e) {
    return undefined;
  }
}
