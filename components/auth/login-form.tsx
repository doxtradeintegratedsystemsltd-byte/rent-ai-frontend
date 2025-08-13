"use client";

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
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/mutations/login";
import { useIsAuthenticated, useUserRole } from "@/store/authStore";
import { useEffect } from "react";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated && userRole) {
      const redirectPath =
        userRole === "tenant"
          ? "/tenant"
          : userRole === "superAdmin"
            ? "/super"
            : "/admin";
      router.push(redirectPath);
    }
  }, [isAuthenticated, userRole, router]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    loginMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  const getErrorMessage = () => {
    if (loginMutation.isError) {
      const error = loginMutation.error as Error & {
        response?: {
          data?: {
            message?: string;
          };
        };
      };
      if (error?.response?.data?.message) {
        return error.response.data.message;
      }
      return error?.message || "Login failed. Please try again.";
    }
    return null;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 md:w-5/6"
      >
        <h1 className="mb-10 text-4xl font-extrabold">Login</h1>

        {getErrorMessage() && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-600">
              {getErrorMessage()}
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email address" {...field} />
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
              <FormLabel required>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
          <Icon
            icon="material-symbols:east-rounded"
            className="ml-2"
            size="lg"
          />
        </Button>
        <Link href="/forgot-password">Forgot Password?</Link>
        <footer className="absolute bottom-0 hidden pb-4 md:block">
          <p>©2025</p>
        </footer>
      </form>
    </Form>
  );
}
