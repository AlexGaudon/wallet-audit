import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const displayAmount = (amount: number) => (amount / 100).toFixed(2);

export function getFirstDayOfMonth(date: Date): string {
  const firstDayOfMonth = new Date(date);
  firstDayOfMonth.setDate(1);
  const formattedDate = firstDayOfMonth.toISOString().split("T")[0];
  return formattedDate;
}

export function getLastDayOfMonth(date: Date): string {
  const lastDayOfMonth = new Date(date);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1, 0);
  const formattedDate = lastDayOfMonth.toISOString().split("T")[0];
  return formattedDate;
}
