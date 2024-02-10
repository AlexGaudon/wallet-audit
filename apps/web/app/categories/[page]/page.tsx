import { getSession, initPocketbaseFromCookie } from "@/lib/pb";
import { redirect } from "next/navigation";

import { CategoriesDisplay } from "@/components/categories-display";
import CreateCategoryForm from "@/components/create-category-form";
import { Paginator } from "@/components/pagination";
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

  const categories = await pb
    .collection<Category>("categories")
    .getList(pageAsNumber, 4, {
      expand: "keywords",
    });

  if (categories.items.length === 0 && categories.totalPages > 0) {
    redirect("/categories/1");
  }

  return (
    <main className="m-4 w-full">
      <h1 className="font-bold text-2xl mb-2">Categories</h1>
      <div className="grid grid-cols-2 min-w-full w-full items-center justify-center">
        <CreateCategoryForm />
        <div>
          <Paginator
            url="categories"
            page={pageAsNumber}
            totalPages={categories.totalPages}
          />
        </div>
      </div>
      <CategoriesDisplay categories={categories.items} />
    </main>
  );
}
