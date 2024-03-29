"use client";
import { importTransactions } from "@/lib/actions";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";

export function ImportForm() {
  const { toast } = useToast();
  const onFileLoaded = async (data: string) => {
    await importTransactions(data);
    toast({
      description: "Done importing transactions.",
    });
  };
  return (
    <form>
      <Toaster />
      <Input
        className="h-[500px] bg-primary-foreground"
        type="file"
        accept=".qfx"
        multiple={true}
        onChange={(e) => {
          let reader = new FileReader();

          const files = e.target.files;

          if (files === null) {
            return;
          }

          const readFile = (idx: number) => {
            if (idx > files.length - 1) return;

            const file = files[idx];

            reader.onload = (_event: Event) => {
              onFileLoaded(reader.result as string);
              readFile(idx + 1);
            };
            reader.readAsText(file);
          };

          readFile(0);
        }}
      />
    </form>
  );
}
