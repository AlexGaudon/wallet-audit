import { DailySpending } from "@/components/daily-spending";
import { getCategorizedSpendingByDay } from "@/lib/data-fetching";
import { initPocketbaseFromCookie } from "@/lib/pb";

import { type Category } from "@/lib/definitions";

export default async function Insights({
  searchParams,
}: {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) {
  let period = new Date();

  if (searchParams !== undefined) {
    period.setDate(1);
    if ("month" in searchParams) {
      period.setMonth(Number(searchParams?.month) - 1);
    }
    if ("year" in searchParams) {
      period.setFullYear(Number(searchParams?.year));
    }
  }

  const pb = await initPocketbaseFromCookie();
  const data = await getCategorizedSpendingByDay(period);

  const categories = await pb.collection<Category>("categories").getFullList();

  return <DailySpending realData={data} categories={categories} />;
}
