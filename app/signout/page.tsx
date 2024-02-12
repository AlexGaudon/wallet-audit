"use client";

import { signOut } from "@/lib/actions";
import { useEffect } from "react";

export default function SignOut() {
  useEffect(() => {
    signOut().then(() => {});
  }, []);
  return <h1>Signing out...</h1>;
}
