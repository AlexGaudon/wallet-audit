import { SignUpForm } from "@/components/sign-up-form";
import { getSession } from "@/lib/pb";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-xl mt-4">
      <SignUpForm />
    </main>
  );
}
