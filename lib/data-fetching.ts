import { initPocketbaseFromCookie } from "./pb"
import type { Category, Transaction } from "@/lib/definitions";

export async function getTransactions(count: number, page: number) {
    const pb = await initPocketbaseFromCookie();
    return await pb.collection<Transaction>('transactions')
    .getList(page, count, {
        expand: 'category',
        sort: '-date'
    })
}