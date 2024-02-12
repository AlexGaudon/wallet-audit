"use client";
import { signIn } from "@/lib/actions";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { Toaster } from "./ui/toaster";
import { useToast } from "./ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

export function SignInForm() {
  const [code, action] = useFormState(signIn, undefined);

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const fd = new FormData();

    fd.set("email", values.email);
    fd.set("password", values.password);
    action(fd);
  }

  const { toast } = useToast();

  useEffect(() => {
    toast({
      description: code,
    });
    if (code === "ok") {
      redirect("/");
    } else if (code === "AuthError") {
      toast({
        description: "Login credentials are invalid.",
        variant: "destructive",
      });
    }
  }, [code]);

  return (
    <>
      <Toaster />
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="me@example.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

{
  /* <form action={action}>
  <Card className="w-full max-w-full min-w-full">
    <CardHeader className="flex flex-col items-center space-y-2">
      <h2 className="text-2xl font-bold">Sign in to your account</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enter your credentials below
      </p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" placeholder="me@example.com" />
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
</form> */
}
