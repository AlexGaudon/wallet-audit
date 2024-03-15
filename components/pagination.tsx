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
          let newUrl = window.location.href;
          newUrl = newUrl.replace(`/${url}/${page}`, `/${url}/${page-1}`)
          router.replace(newUrl)
        }}
      >
        {"<"}
      </Button>
      <span className="mx-2">Page {page}</span>
      <Button
        disabled={!(page < totalPages)}
        onClick={() => {
          let newUrl = window.location.href;
          newUrl = newUrl.replace(`/${url}/${page}`, `/${url}/${page+1}`)
          router.replace(newUrl)
        }}
      >
        {">"}
      </Button>
    </>
  );
}
