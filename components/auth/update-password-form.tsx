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
import { useSearchParams, useRouter } from "next/navigation";
import {
  useResetPassword,
  useVerifyPasswordResetLinkQuery,
} from "@/mutations/login";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/error";
import { useEffect, useState } from "react";

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function UpdatePasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const userId = searchParams.get("userId") ?? "";
  const router = useRouter();
  const { mutateAsync, isPending } = useResetPassword();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isInvalidLink, setIsInvalidLink] = useState(false);
  const [targetEmail, setTargetEmail] = useState<string | null>(null);
  const {
    data: verifyData,
    isLoading: isVerifying,
    isError: verifyError,
  } = useVerifyPasswordResetLinkQuery(token, userId);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Early param validation
    if (!token || !userId) {
      setIsInvalidLink(true);
      setIsValidating(false);
      return;
    }
    // React-query manages loading; map its states to local UI flags once
    if (isVerifying) {
      setIsValidating(true);
      return;
    }

    // Completed state
    if (verifyError) {
      setIsInvalidLink(true);
      setIsValidating(false);
      return;
    }

    if (verifyData) {
      if (verifyData.status === "success") {
        setTargetEmail(verifyData.data?.email ?? null);
        setIsInvalidLink(false);
      } else {
        setIsInvalidLink(true);
      }
      setIsValidating(false);
    }
  }, [token, userId, isVerifying, verifyError, verifyData]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    if (!token || !userId) {
      toast.error("Invalid or missing reset link. Please retry the flow.");
      return;
    }
    try {
      const res = await mutateAsync({
        token,
        userId,
        password: values.password,
      });
      toast.success(res.message || "Password Reset Success");
      setIsSuccess(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to reset password"));
    }
  }

  return (
    <div className="bg-background flex flex-col gap-6 rounded-md px-10 py-8 md:w-[500px]">
      {isValidating ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Icon icon="eos-icons:loading" size={32} className="animate-spin" />
          <p>Validating link...</p>
        </div>
      ) : isInvalidLink ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Icon
            icon="material-symbols:error-circle-rounded"
            size={48}
            className="text-red-600"
          />
          <h1 className="text-2xl font-extrabold md:text-4xl">
            Invalid Reset Link
          </h1>
          <p>
            The password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Button
            className="w-full"
            onClick={() => router.push("/forgot-password")}
          >
            Request new link
          </Button>
        </div>
      ) : isSuccess ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Icon
            icon="material-symbols:check-circle-rounded"
            size={48}
            className="text-green-600"
          />
          <h1 className="text-2xl font-extrabold md:text-4xl">
            Password Reset Successful
          </h1>
          <p>You can proceed to login.</p>
          <Button className="w-full" onClick={() => router.push("/")}>
            Login
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <h1 className="text-center text-2xl font-extrabold md:text-4xl">
              Update Password
            </h1>
            {targetEmail && (
              <p className="text-muted-foreground text-center text-sm">
                Updating password for{" "}
                <span className="font-medium">{targetEmail}</span>
              </p>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
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
                  <FormLabel required>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Re-enter password"
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
              disabled={isPending || isValidating || isVerifying}
            >
              {isPending
                ? "Updating..."
                : isVerifying
                  ? "Verifying..."
                  : "Update Password"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
