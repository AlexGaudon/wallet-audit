"use client";
import { createTabTransaction } from "@/lib/actions";
import { CornerDownLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Toaster } from "./ui/toaster";
import { useToast } from "./ui/use-toast";

export default function AddTransactionForm({ tabId }: { tabId: string }) {
  const [code, action] = useFormState(createTabTransaction, undefined);
  const ref = useRef<HTMLFormElement>(null);

  const [type, setType] = useState<string>();

  const { toast } = useToast();

  useEffect(() => {
    if (code?.startsWith("failed")) {
      toast({
        description: code,
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
          setType("");
        }}
        className="flex"
      >
        <input className="hidden" readOnly value={tabId} name="tabId" />
        <Select
          name="type"
          value={type}
          onValueChange={(val) => {
            setType(val);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"paid me"}>paid me</SelectItem>
            <SelectItem value={"owes me"}>owes me</SelectItem>
            <SelectItem value={"I owe"}>I owe</SelectItem>
            <SelectItem value={"I paid"}>I paid</SelectItem>
          </SelectContent>
        </Select>
        <Input name="amount" type="number" step="0.01" placeholder="Amount" />
        <Button>
          <CornerDownLeftIcon />
        </Button>
      </form>
    </div>
  );
}
