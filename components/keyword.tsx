"use client";

import { Keyword } from "@/lib/definitions";

export function Keyword({
  keyword,
  className,
}: {
  keyword: Keyword;
  className?: string;
}) {
  return <h1 className={className}>{keyword.keyword}</h1>;
}
