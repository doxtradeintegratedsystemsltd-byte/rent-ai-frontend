"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
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
import { Dropdown } from "@/components/ui/dropdown";
import { formatDropdownItems } from "@/lib/formatters";
import { useEditTenant } from "@/mutations/tenant";
import { Tenant } from "@/types/tenant";
import { getApiErrorMessage } from "@/lib/error";

const FormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  levelOfEducation: z
    .string()
    .min(1, { message: "Level of education is required" }),
});

const levelOfEducationItems = [
  "Primary School",
  "Secondary School",
  "Tertiary Institution",
  "Postgraduate",
];

interface EditTenantFormProps {
  tenant?: Tenant;
  onSuccess?: () => void;
}

const EditTenantForm = ({ tenant, onSuccess }: EditTenantFormProps) => {
  const editTenantMutation = useEditTenant();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      levelOfEducation: "",
    },
  });

  // Populate form with existing tenant data
  useEffect(() => {
    if (tenant) {
      form.reset({
        firstName: tenant.firstName || "",
        lastName: tenant.lastName || "",
        email: tenant.email || "",
        phoneNumber: tenant.phoneNumber || "",
        levelOfEducation: tenant.levelOfEducation || "",
      });
    }
  }, [tenant, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!tenant?.id) {
      toast.error("Tenant ID is required");
      return;
    }

    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        levelOfEducation: data.levelOfEducation,
      };

      await editTenantMutation.mutateAsync({
        tenantId: tenant.id,
        tenantData: payload,
      });

      toast.success("Tenant updated successfully!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating tenant:", error);
      toast.error(
        getApiErrorMessage(error, "Failed to update tenant. Please try again."),
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required className="text-sm">
                  First name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter tenant's first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required className="text-sm">
                  Last name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter tenant's last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="text-sm">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tenant's email address"
                  {...field}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm" required>
                Phone Number
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter tenant's phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="levelOfEducation"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel required className="text-sm">
                Level of Education
              </FormLabel>
              <FormControl>
                <Dropdown
                  trigger={{
                    label: field.value || "Select tenant’s level of education",
                    arrowIcon: "material-symbols:keyboard-arrow-down",
                    className: "w-full justify-between",
                  }}
                  items={formatDropdownItems(levelOfEducationItems)}
                  onItemSelect={(value) => field.onChange(value)}
                  className="w-full px-4 py-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full uppercase"
          disabled={!form.formState.isValid || editTenantMutation.isPending}
        >
          {editTenantMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default EditTenantForm;
