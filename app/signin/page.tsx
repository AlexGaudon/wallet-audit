import { SignInForm } from "@/components/sign-in-form";
import { getSession } from "@/lib/pb";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full mt-4">
      <SignInForm />
    </main>
  );
}
