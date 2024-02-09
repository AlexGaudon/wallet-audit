"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/actions";
import Link from "next/link";
import { useFormState } from "react-dom";

export function SignUpForm() {
  const [code, action] = useFormState(signUp, undefined);
  return (
    <form action={action}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center space-y-2">
          <h2 className="text-2xl font-bold">Sign up for an account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your credentials below
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="me@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" />
          </div>
          <Button className="w-full" type="submit">
            Sign In
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link className="text-sm underline" href="#">
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}
