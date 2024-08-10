"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import AlertDialogComponent from "./Alert";

// ********************************** zod schema **********************************************

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
});

// ********************************* Main function ********************************************
export default function RegisterForm() {
  const [eror, setEror] = useState("");
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const {
    reset,
    formState: { isSubmitting },
    setError,
  } = form;

  // ************************************* function sending data to api ************************************
  const registerUser = async (values: any) => {
    try {
      const response = await fetch("http://localhost:8000/user/register_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccessAlertOpen(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "REGISTRATION FAILED");
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message == "Email already registered"
      ) {
        setEror(error.message);
      } else {
        setEror(`An error occurred during registration.`);
      }
    }
  };
  // **************************************** Main function onSubmit ****************************************
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.password !== values.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords must match",
        });
        return;
      }
      await registerUser(values);

      reset();
    } catch (error: any) {
      setEror(error.message);
    }
  }
  // ********************************* Main UI ************************************
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-96 mx-auto my-10 border p-4 rounded-md shadow-md shadow-gray-500"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Name.." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter Password Again.." {...field} />
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
          {isSubmitting ? "Submitting..." : "Register"}
        </Button>
        <AlertDialogComponent
          isOpen={isSuccessAlertOpen}
          onOpenChange={setIsSuccessAlertOpen}
        />
        <div className="text-center">OR</div>
        <p className="text-sm">
          <Link href={"/auth/login"} className="text-blue-400 underline">
            Login here
          </Link>{" "}
          if already register.
        </p>
      </form>
    </Form>
  );
}
