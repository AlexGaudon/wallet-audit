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
    if (code?.startsWith("failed")) {
      toast({
        description: "A transaction with this name already exists.",
        variant: "destructive",
      });
    }
  }, [code]);

  return (
    <div className="px-2 py-4">
      <Toaster />
      <form
        ref={ref}
        action={async (formData) => {
          action(formData);

          ref.current?.reset();
        }}
        className="flex"
      >
        <Input name="categoryName" type="text" placeholder="New Category" />
        <Button>
          <CornerDownLeftIcon />
        </Button>
      </form>
    </div>
  );
}
