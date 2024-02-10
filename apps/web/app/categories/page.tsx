"use client";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  router.push(`/categories/1`);
}
