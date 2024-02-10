"use client";
import { importTransactions } from "@/lib/actions";
import { Input } from "./ui/input";

export function ImportForm() {
  const onFileLoaded = async (name: string, data: string) => {
    await importTransactions(name, data);
  };
  return (
    <form>
      <Input
        type="file"
        onChange={(e) => {
          let reader = new FileReader();

          const files = e.target.files;

          if (files === null) {
            return;
          }

          reader.onload = (_event: Event) => {
            console.log(_event);

            onFileLoaded(files[0].name, reader.result as string);
          };

          reader.readAsText(files[0]);
        }}
      />
    </form>
  );
}
