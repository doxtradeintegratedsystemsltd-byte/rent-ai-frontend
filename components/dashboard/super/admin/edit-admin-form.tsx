"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
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
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  displayPhoto: z.instanceof(File).optional(),
});

const EditAdminForm = () => {
  // Simulated user data from backend
  const userData = {
    firstName: "Bala",
    lastName: "Joseph",
    email: "bjoseph@gmail.com",
    phoneNumber: "08112345678",
    displayPhoto: "/images/big-avatar.png",
  };

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    userData.displayPhoto,
  );
  const [fileInputKey, setFileInputKey] = useState(0);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      displayPhoto: undefined,
    },
  });

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(userData.displayPhoto);
    }
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Display Photo
            </p>
            <div className="flex items-center gap-4">
              <div className="border-border h-20 w-20 overflow-hidden rounded-full border">
                <Image
                  src={photoPreview || "/images/big-avatar.png"}
                  alt="Profile Avatar"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="displayPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <div className="bg-muted w-full rounded-md border text-center">
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
                        </div>
                      </FormControl>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Image file size should be under 2MB
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-sm">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-sm">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
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
                    placeholder="Enter email address"
                    type="email"
                    {...field}
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
                <FormLabel required className="text-sm">
                  Phone number
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full uppercase">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditAdminForm;
