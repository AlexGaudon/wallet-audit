import { ImportForm } from "@/components/import-form";
import { getSession } from "@/lib/pb";
import { redirect } from "next/navigation";

export default async function ImportPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="m-4 w-full">
      <h1 className="font-bold text-2xl mb-2">Import Transactions</h1>
      <ImportForm />
    </main>
  );
}
