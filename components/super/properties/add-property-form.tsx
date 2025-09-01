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
import { Dropdown } from "@/components/ui/dropdown";
import { formatDropdownItems } from "@/lib/formatters";
import { useState } from "react";
import { Icon } from "../../ui/icon";
import Image from "next/image";
import { usePropertyImageUpload } from "@/mutations/upload";
import { useCreatePropertyForAdmin } from "@/mutations/property";
import { toast } from "sonner";

const FormSchema = z.object({
  propertyName: z.string().min(1, { message: "House name is required" }),
  propertyState: z.string().min(1, { message: "House state is required" }),
  propertyArea: z.string().min(1, { message: "House area is required" }),
  propertyAddress: z.string().min(1, { message: "Address is required" }),
  propertyImage: z.instanceof(File, { message: "House image is required" }),
  leaseYears: z.number().min(1, { message: "Lease duration is required" }),
  rentAmount: z.number().min(1, { message: "Rent amount is required" }),
});

interface PropertySubmissionData {
  propertyName: string;
  propertyState: string;
  propertyArea: string;
  propertyAddress: string;
  propertyImage: string;
  leaseYears: number;
  rentAmount: number;
  adminId: string;
}

interface AddPropertyFormProps {
  adminId: string;
}

const AddPropertyForm = ({ adminId }: AddPropertyFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const imageUpload = usePropertyImageUpload();
  const createProperty = useCreatePropertyForAdmin();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      propertyName: "",
      propertyState: "",
      propertyArea: "",
      propertyAddress: "",
      propertyImage: undefined,
      leaseYears: 0,
      rentAmount: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const imageUrl = await imageUpload.uploadImageForProperty(
      data.propertyImage,
    );

    const propertyData: PropertySubmissionData = {
      propertyName: data.propertyName,
      propertyState: data.propertyState,
      propertyArea: data.propertyArea,
      propertyAddress: data.propertyAddress,
      propertyImage: imageUrl,
      leaseYears: data.leaseYears,
      rentAmount: data.rentAmount,
      adminId: adminId,
    };

    createProperty.mutate(propertyData, {
      onSuccess: () => {
        toast.success("House created successfully.");
        form.reset();
        setImagePreview(null);
        setFileInputKey((prev) => prev + 1);
      },
      onError: (error) => {
        toast.error("Failed to create house. Please try again.");
        console.error("Error submitting property:", error);
      },
    });
  };

  const states = ["Lagos", "Abuja", "Kano", "Rivers", "Ogun"];
  const areas = ["Victoria Island", "Lekki", "Ikeja", "Surulere", "Ikoyi"];

  const leaseYearsOptions = [
    { label: "1 year", value: "1" },
    { label: "2 years", value: "2" },
    { label: "3 years", value: "3" },
    { label: "4 years", value: "4" },
    { label: "5 years", value: "5" },
  ];

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.resetField("propertyImage");
    setFileInputKey((prev) => prev + 1); // Force re-render of input to clear file
  };

  const isFormDisabled = imageUpload.isPending || createProperty.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="propertyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="text-sm">
                House name
              </FormLabel>
              <FormControl>
                <Input
                  className="py-2"
                  placeholder="Enter house name"
                  disabled={isFormDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="propertyState"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required className="text-sm">
                  House state
                </FormLabel>
                <FormControl>
                  <Dropdown
                    trigger={{
                      label: field.value || "Select state",
                      arrowIcon: "material-symbols:keyboard-arrow-down",
                      className: `w-full justify-between ${isFormDisabled ? "opacity-50 pointer-events-none" : ""}`,
                    }}
                    items={formatDropdownItems(states)}
                    onItemSelect={(value) =>
                      !isFormDisabled && field.onChange(value)
                    }
                    className="w-full px-4 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyArea"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required className="text-sm">
                  House area
                </FormLabel>
                <FormControl>
                  <Dropdown
                    trigger={{
                      label: field.value || "Select area",
                      arrowIcon: "material-symbols:keyboard-arrow-down",
                      className: `w-full justify-between ${isFormDisabled ? "opacity-50 pointer-events-none" : ""}`,
                    }}
                    items={formatDropdownItems(areas)}
                    onItemSelect={(value) =>
                      !isFormDisabled && field.onChange(value)
                    }
                    className="w-full px-4 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="propertyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="text-sm">
                House address
              </FormLabel>
              <FormControl>
                <Input
                  className="py-2"
                  placeholder="Enter full address of the house"
                  disabled={isFormDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="text-sm">
                House image
              </FormLabel>
              <FormControl>
                <div className="bg-muted rounded-md border text-center">
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    disabled={isFormDisabled}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        field.onChange(e.target.files[0]);
                        handleImageChange(e.target.files[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex cursor-pointer items-center justify-between p-4"
                  >
                    <span className="text-muted-foreground text-sm font-medium">
                      {imagePreview
                        ? form.getValues("propertyImage")?.name ||
                          "Change image"
                        : "Select image to upload"}
                    </span>
                    <Icon icon="material-symbols:upload-rounded" />
                  </label>
                </div>
              </FormControl>
              <p className="text-muted-foreground mt-1 text-xs">
                {!imagePreview && "Image file size should be under 2MB."}
              </p>

              {imagePreview && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-muted-foreground mb-2 text-sm">
                    Image preview
                  </p>
                  <div className="">
                    <div className="border-border relative h-20 w-28 overflow-hidden rounded-lg border">
                      <Image
                        width={112}
                        height={80}
                        src={imagePreview}
                        alt="House preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={removeImage}
                      className="text-muted-foreground hover:text-foreground mt-2 h-auto p-0"
                      disabled={isFormDisabled}
                    >
                      Remove image
                    </Button>
                  </div>
                </div>
              )}

              {imageUpload.isPending && (
                <p className="text-muted-foreground mt-2 text-sm">
                  Uploading image...
                </p>
              )}
              {imageUpload.isError && (
                <p className="mt-2 text-sm text-red-600">
                  Image upload failed. Please try again.
                </p>
              )}

              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-muted-foreground font-medium uppercase">Tenancy</p>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="leaseYears"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required className="text-sm">
                  Lease Duration
                </FormLabel>
                <FormControl>
                  <Dropdown
                    trigger={{
                      label: field.value
                        ? leaseYearsOptions.find(
                            (opt) => opt.value === field.value.toString(),
                          )?.label || "Select lease duration"
                        : "Select lease duration",
                      arrowIcon: "material-symbols:keyboard-arrow-down",
                      className: `w-full justify-between ${isFormDisabled ? "opacity-50 pointer-events-none" : ""}`,
                    }}
                    items={leaseYearsOptions}
                    onItemSelect={(value) =>
                      !isFormDisabled && field.onChange(parseInt(value))
                    }
                    className="w-full px-4 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rentAmount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required className="text-sm">
                  Rent Amount (₦)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="py-2"
                    placeholder="Enter rent amount (e.g., 150000)"
                    disabled={isFormDisabled}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      )
                    }
                    min="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {createProperty.isError && (
          <p className="mt-2 text-sm text-red-600">
            Failed to create house. Please try again.
          </p>
        )}

        <Button
          type="submit"
          className="w-full uppercase"
          disabled={!form.formState.isValid || isFormDisabled}
        >
          {createProperty.isPending
            ? "Adding House..."
            : imageUpload.isPending
              ? "Uploading Image..."
              : "Add House"}
        </Button>
      </form>
    </Form>
  );
};

export default AddPropertyForm;
