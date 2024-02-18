import { getCategorizedSpendingByDay } from "@/lib/data-fetching";
import { DailySpending } from "@/components/daily-spending";

export default async function Insights() {
  const lastWeek = new Date(new Date().setDate(1));
  const data = await getCategorizedSpendingByDay(lastWeek, 7);

  //   return <pre>{JSON.stringify(data, null, 2)}</pre>;
  return <DailySpending realData={data} />;
}
