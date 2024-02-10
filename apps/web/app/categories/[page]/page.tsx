import { getSession, initPocketbaseFromCookie } from "@/lib/pb";
import { redirect } from "next/navigation";

import {
  CategoriesDisplay,
  CategoriesPagination,
} from "@/components/categories-display";
import CreateCategoryForm from "@/components/create-category-form";
import { type Category } from "@/lib/definitions";

export default async function CategoriesPage({
  params,
}: {
  params: { page: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const pb = await initPocketbaseFromCookie();

  const pageAsNumber = Number.parseInt(params.page, 10);

  let res = await pb
    .collection<Category>("categories")
    .getList(pageAsNumber, 5);

  if (res.items.length === 0 && res.totalPages > 0) {
    redirect("/categories/1");
  }

  return (
    <main className="m-4 w-full">
      <h1 className="font-bold text-2xl mb-2">Categories</h1>

      <div className="grid grid-cols-2 min-w-full w-full items-center justify-center">
        <CreateCategoryForm />
        <div>
          <CategoriesPagination
            page={pageAsNumber}
            totalPages={res.totalPages}
          />
        </div>

        <CategoriesDisplay
          categories={res.items}
          page={res.page}
          totalPages={res.totalPages}
        />
      </div>
    </main>
  );
}
