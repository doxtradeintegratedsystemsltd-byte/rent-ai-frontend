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
import { useForgotPassword } from "@/mutations/login";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/error";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export function ForgotPasswordForm() {
  const { mutateAsync, isPending } = useForgotPassword();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const res = await mutateAsync({ email: values.email });
      toast.success(
        res.message || "If email exists, a password reset link has been sent",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to send reset link"));
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-background flex flex-col gap-6 rounded-md px-10 py-8 md:w-[500px]"
      >
        <h1 className="text-center text-2xl font-extrabold md:text-4xl">
          Forgot password?
        </h1>
        <p>Enter your email address to receive a password reset link.</p>

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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
