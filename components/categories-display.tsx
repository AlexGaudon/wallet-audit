"use client";
import { deleteCategory } from "@/lib/actions";
import { type Category } from "@/lib/definitions";
import { TrashIcon } from "lucide-react";
import CreateKeywordForm from "./create-keyword-form";
import { Keyword } from "./keyword";
import { Card, CardContent, CardHeader } from "./ui/card";

function Category({ category }: { category: Category }) {
  return (
    <Card className="grid grid-cols-2">
      <CardHeader>
        <div className="flex items-center">
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
          <span className="text-2xl">{category.name}</span>
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

export function CategoriesDisplay({ categories }: { categories: Category[] }) {
  return (
    <>
      {categories.map((category) => (
        <Category key={category.id} category={category} />
      ))}
    </>
  );
}
