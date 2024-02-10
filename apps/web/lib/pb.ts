import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import Pocketbase from "pocketbase";
import { User } from "./definitions";

export async function getSession() {
  const pb = await initPocketbaseFromCookie();
  if (!pb.authStore.isValid) {
    return undefined;
  }
  const authUser = pb.authStore.model as User;

  return authUser;
}

export async function initPocketbaseFromCookie() {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_API_URL);

  pb.authStore.loadFromCookie(cookies().get("pb_auth")?.value || "");

  return pb;
}

export async function initPocketBaseFromRequest(request: NextRequest) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_API_URL);

  // load the store data from the request cookie string
  pb.authStore.loadFromCookie(request?.cookies.get("pb_auth")?.value || "");
  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    request.cookies.set("pb_auth", pb.authStore.exportToCookie());
  });

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid && (await pb.collection("users").authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  return pb;
}
