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

export default function CategoriesDisplay({
  categories,
  page,
  totalPages,
}: {
  categories: Category[];
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  return (
    <>
      <div className="float-right ml-auto">
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
      </div>
      {categories.map((category) => (
        <Category category={category} />
      ))}
    </>
  );
}
