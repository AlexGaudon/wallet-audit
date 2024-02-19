import { getCategorizedSpendingByDay } from "@/lib/data-fetching";
import { DailySpending } from "@/components/daily-spending";
import { initPocketbaseFromCookie } from "@/lib/pb";

import { type Category } from "@/lib/definitions";

export default async function Insights() {
  const pb = await initPocketbaseFromCookie();
  const lastWeek = new Date(new Date().setDate(1));
  const data = await getCategorizedSpendingByDay(lastWeek, 7);

  const categories = await pb.collection<Category>("categories").getFullList();

  return <DailySpending realData={data} categories={categories} />;
}
