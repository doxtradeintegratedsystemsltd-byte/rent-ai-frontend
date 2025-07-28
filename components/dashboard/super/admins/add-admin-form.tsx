"use client";

import { useState } from "react";
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

const FormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  displayPhoto: z.instanceof(File).optional(),
});

const AddAdminForm = ({
  setIsSubmitted,
}: {
  setIsSubmitted?: (value: boolean) => void;
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      displayPhoto: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form submitted with data:", data);
    setIsSubmitted && setIsSubmitted(true);
  };

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    form.setValue("displayPhoto", undefined as any);
    setFileInputKey((prev) => prev + 1); // Force re-render of input to clear file
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required>First name</FormLabel>
                <FormControl>
                  <Input placeholder="Bala" {...field} />
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
                <FormLabel required>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Joseph" {...field} />
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
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input placeholder="bjoseph@gmail.com" {...field} />
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
              <FormLabel required>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="08112345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="displayPhoto"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Display photo</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {!photoPreview ? (
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
                            handlePhotoChange(e.target.files[0]);
                          }
                        }}
                      />
                      <label
                        htmlFor="photo-upload"
                        className="flex cursor-pointer items-center justify-between p-4"
                      >
                        <span className="text-muted-foreground text-sm font-medium">
                          Select image to upload
                        </span>
                        <Icon icon="material-symbols:upload-rounded" />
                      </label>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-muted-foreground mb-2 text-sm">
                        Image preview
                      </p>
                      <div className="">
                        <div className="border-border relative h-28 w-28 overflow-hidden rounded-lg border">
                          <img
                            src={photoPreview}
                            alt="Image preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={removePhoto}
                          className="text-muted-foreground hover:text-foreground mt-2 h-auto p-0"
                        >
                          Remove image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <p className="text-muted-foreground mt-1 text-xs">
                Image file size should be under 2MB.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-black text-white uppercase hover:bg-gray-800"
        >
          Add
        </Button>
      </form>
    </Form>
  );
};

export default AddAdminForm;
