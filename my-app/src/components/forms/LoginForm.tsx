"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { loginUser, logout, setAuth } from "@/app/store/features/authSlice";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import { LoginUsertype } from "@/app/types";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    reset,
    formState: { isSubmitting },
    setError,
  } = form;
  const [eror, setEror] = useState("");
  // async function loginUser(values: LoginUsertype) {

  // }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("IN submit start");
      const resultAction = await dispatch(loginUser(values)); // Dispatch the loginUser action
      if (loginUser.fulfilled.match(resultAction)) {
        // Login successful
        console.log("IN submit success");
        router.push("/");
        reset();
      } else {
        // Login failed
        console.log("IN submit error");
        setError("password", {
          type: "manual",
          message: "Login failed",
        });
      }
    } catch (error: any) {
      console.error("Unexpected error during login:", error);
      // Handle unexpected errors, maybe show a generic error message
    }
  }

  return (
    <section className="flex items-center justify-center min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-96 mx-auto my-10 border p-4 rounded-md shadow-md shadow-gray-500"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter you Email" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="Enter you Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {eror && <p className="text-red-500 text-sm">{eror}</p>}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting && "cursor-not-allowed"}`}
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </Button>
          <div className="text-center">OR</div>
          <p className="text-sm">
            <Link href={"/auth/register"} className="text-blue-400 underline">
              Register here
            </Link>{" "}
            if you are new user.
          </p>
        </form>
      </Form>
    </section>
  );
}
