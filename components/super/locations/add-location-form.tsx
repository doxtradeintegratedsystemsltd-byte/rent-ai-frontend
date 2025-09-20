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
import { useCreateLocation } from "@/mutations/locations";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/error";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Location name is required" }),
});

const AddLocationForm = ({
  setIsSubmitted,
}: {
  setIsSubmitted?: (value: boolean) => void;
}) => {
  const createLocation = useCreateLocation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    createLocation.mutate(data, {
      onSuccess: () => {
        toast.success("Location created successfully");
        form.reset();
        setIsSubmitted?.(true);
      },
      onError: (error) => {
        toast.error(
          getApiErrorMessage(
            error,
            "Failed to create location. Please try again.",
          ),
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Location Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Mabushi 1"
                  {...field}
                  disabled={createLocation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {createLocation.isError && (
          <p className="mt-2 text-sm text-red-600">
            Failed to create location. Please try again.
          </p>
        )}

        <Button
          type="submit"
          className="w-full uppercase"
          disabled={!form.formState.isValid || createLocation.isPending}
        >
          {createLocation.isPending ? "Adding Location..." : "Add Location"}
        </Button>
      </form>
    </Form>
  );
};

export default AddLocationForm;
