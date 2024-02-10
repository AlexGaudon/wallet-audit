"use client";
import { type Category } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function Category({ category }: { category: Category }) {
  return (
    <main>
      <h1>Name: {category.name}</h1>
    </main>
  );
}

export function CategoriesPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();

  return (
    <>
      <Button
        disabled={!(page > 1)}
        onClick={() => {
          router.push(`/categories/${page - 1}`);
        }}
      >
        {"<"}
      </Button>
      <span className="mx-2">Page {page}</span>
      <Button
        disabled={!(page < totalPages)}
        onClick={() => {
          router.push(`/categories/${page + 1}`);
        }}
      >
        {">"}
      </Button>
    </>
  );
}

export function CategoriesDisplay({ categories }: { categories: Category[] }) {
  return (
    <>
      {categories.map((category) => (
        <Category category={category} />
      ))}
    </>
  );
}
