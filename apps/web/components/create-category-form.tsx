"use client";
import { createCategory } from "@/lib/actions";
import { CornerDownLeftIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toaster } from "./ui/toaster";
import { useToast } from "./ui/use-toast";

export default function CreateCategoryForm({
  className,
}: {
  className?: string;
}) {
  const [code, action] = useFormState(createCategory, undefined);
  const ref = useRef<HTMLFormElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (code === "ok") {
      ref.current?.reset();
    }

    if (code === "failed") {
      toast({
        variant: "destructive",
        description: "A category with this name already exists.",
      });
      ref.current?.reset();
    }
  }, [code]);

  return (
    <div className="px-2 py-4">
      <Toaster />
      <form ref={ref} action={action} className="flex">
        <Input name="categoryName" type="text" placeholder="New Category" />
        <Button>
          <CornerDownLeftIcon />
        </Button>
      </form>
    </div>
  );
}
