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
import { Icon } from "../../../ui/icon";

const FormSchema = z.object({
  propertyName: z.string().min(1, { message: "Property name is required" }),
  propertyState: z.string().min(1, { message: "Property state is required" }),
  propertyArea: z.string().min(1, { message: "Property area is required" }),
  propertyAddress: z.string().min(1, { message: "Address is required" }),
  propertyImage: z.instanceof(File, { message: "Property image is required" }),
  rentDuration: z.string().min(1, { message: "Rent duration is required" }),
  rentAmount: z.string().min(1, { message: "Rent amount is required" }),
});

const AddPropertyForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      propertyName: "",
      propertyState: "",
      propertyArea: "",
      propertyAddress: "",
      propertyImage: undefined,
      rentDuration: "",
      rentAmount: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form submitted with data:", data);
  };

  const states = ["Lagos", "Abuja", "Kano", "Rivers", "Ogun"];
  const areas = ["Victoria Island", "Lekki", "Ikeja", "Surulere", "Ikoyi"];
  const rentDurations = ["1 year", "2 years", "3 years", "4 years"];

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
    form.setValue("propertyImage", undefined as any);
    setFileInputKey((prev) => prev + 1); // Force re-render of input to clear file
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="propertyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Property name</FormLabel>
              <FormControl>
                <Input placeholder="Enter property name" {...field} />
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
                <FormLabel required>Property state</FormLabel>
                <FormControl>
                  <Dropdown
                    trigger={{
                      label: field.value || "Select state",
                      arrowIcon: "material-symbols:keyboard-arrow-down",
                      className: "w-full justify-between",
                    }}
                    items={formatDropdownItems(states)}
                    onItemSelect={(value) => field.onChange(value)}
                    className="w-full p-4"
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
                <FormLabel required>Property area</FormLabel>
                <FormControl>
                  <Dropdown
                    trigger={{
                      label: field.value || "Select area",
                      arrowIcon: "material-symbols:keyboard-arrow-down",
                      className: "w-full justify-between",
                    }}
                    items={formatDropdownItems(areas)}
                    onItemSelect={(value) => field.onChange(value)}
                    className="w-full p-4"
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
              <FormLabel required>Property address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full address of the property"
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
              <FormLabel required>Property image</FormLabel>
              <FormControl>
                <div className="bg-muted rounded-md border text-center">
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
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
                      <img
                        src={imagePreview}
                        alt="Property preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={removeImage}
                      className="text-muted-foreground hover:text-foreground mt-2 h-auto p-0"
                    >
                      Remove image
                    </Button>
                  </div>
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-muted-foreground font-medium uppercase">Tenancy</p>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="rentDuration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required className="text-sm">
                  Rent Duration
                </FormLabel>
                <FormControl>
                  <Dropdown
                    trigger={{
                      label: field.value || "Select duration",
                      arrowIcon: "material-symbols:keyboard-arrow-down",
                      className: "w-full justify-between",
                    }}
                    items={formatDropdownItems(rentDurations)}
                    onItemSelect={(value) => field.onChange(value)}
                    className="w-full p-4"
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
                  Rent Amount
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter rent amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full uppercase"
          disabled={!form.formState.isValid}
        >
          Add Property
        </Button>
      </form>
    </Form>
  );
};

export default AddPropertyForm;
