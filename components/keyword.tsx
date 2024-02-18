"use client";

import { Keyword } from "@/lib/definitions";
import { Badge } from "./ui/badge";

export function Keyword({
  keyword,
  className,
}: {
  keyword: Keyword;
  className?: string;
}) {
  return <Badge className={className}>{keyword.keyword}</Badge>;
}
