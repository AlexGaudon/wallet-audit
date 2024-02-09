"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { initPocketbaseFromCookie } from "./pb";

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
    const auth = await pb
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

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const res = await pb.collection("users").create({
      email: email,
      password: password,
      passwordConfirm: password,
      name: name,
    });
    console.log(res);
    return "ok";
  } catch (e) {
    const error = e as Error;
    console.error(e);
    return error.message;
  }
}

export async function signOut() {
  const pb = await initPocketbaseFromCookie();

  pb.authStore.clear();
  cookies().delete("pb_auth");

  redirect("/signin");
}
