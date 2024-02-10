"use client";
import { deleteCategory } from "@/lib/actions";
import { type Category } from "@/lib/definitions";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateKeywordForm from "./create-keyword-form";
import { Keyword } from "./keyword";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

function Category({ category }: { category: Category }) {
  return (
    <Card className="grid grid-cols-2">
      <CardHeader>
        <div className="flex items-center">
          <span className="text-2xl">{category.name}</span>
          <button
            className="w-8"
            onClick={async () => {
              if (
                confirm(`Are you sure you want to delete ${category.name}?`)
              ) {
                await deleteCategory(category.id);
              }
            }}
          >
            <TrashIcon className="w-full" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        {category.expand?.keywords?.map((keyword) => {
          return <Keyword key={keyword.id} keyword={keyword} />;
        })}
        <CreateKeywordForm categoryId={category.id} />
      </CardContent>
    </Card>
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
        <Category key={category.id} category={category} />
      ))}
    </>
  );
}
