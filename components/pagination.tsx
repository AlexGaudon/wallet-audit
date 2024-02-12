"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function Paginator({
  url,
  page,
  totalPages,
}: {
  url: string;
  page: number;
  totalPages: number;
}) {
  const router = useRouter();

  return (
    <>
      <Button
        disabled={!(page > 1)}
        onClick={() => {
          router.push(`/${url}/${page - 1}`);
        }}
      >
        {"<"}
      </Button>
      <span className="mx-2">Page {page}</span>
      <Button
        disabled={!(page < totalPages)}
        onClick={() => {
          router.push(`/${url}/${page + 1}`);
        }}
      >
        {">"}
      </Button>
    </>
  );
}
