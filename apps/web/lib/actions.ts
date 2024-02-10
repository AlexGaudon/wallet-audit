"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Category } from "./definitions";
import { getSession, initPocketbaseFromCookie } from "./pb";

export async function createCategory(
  prevState: string | undefined,
  formData: FormData
) {
  const name = formData.get("categoryName");

  const pb = await initPocketbaseFromCookie();

  const session = await getSession();

  try {
    const res = await pb.collection<Category>("categories").create({
      name,
      user: session?.id,
    });
    revalidatePath("/categories/");
    return res.id;
  } catch (e) {
    console.log(e);
    return `failed ${name}`;
  }
}

export async function signIn(
  prevState: string | undefined,
  formData: FormData
) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email == null || password == null) {
    return "fields";
  }

  try {
    const pb = await initPocketbaseFromCookie();
    await pb
      .collection("users")
      .authWithPassword(email as string, password as string);

    if (pb.authStore.isValid) {
      cookies().set("pb_auth", pb.authStore.exportToCookie());
    }

    return "ok";
  } catch (e) {
    console.error(e);
    return "AuthError";
  }
}

export async function signUp(
  prevState: string | undefined,
  formData: FormData
) {
  const pb = await initPocketbaseFromCookie();

  const name = formData.get("displayName");
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    await pb.collection("users").create({
      email: email,
      password: password,
      passwordConfirm: password,
      name: name,
    });
    return "ok";
  } catch (e) {
    const error = e as Error;
    console.error(e);
    return "A user with this email already exists.";
  }
}

export async function signOut() {
  const pb = await initPocketbaseFromCookie();

  pb.authStore.clear();
  cookies().delete("pb_auth");

  redirect("/signin");
}
