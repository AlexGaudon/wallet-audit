"use client";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const router = useRouter();
  router.push(`/transactions/1`);
}
