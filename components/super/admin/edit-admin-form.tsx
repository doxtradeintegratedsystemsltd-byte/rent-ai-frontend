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
import { useUpdateAdmin } from "@/mutations/admin";
import { useSingleImageUpload } from "@/mutations/upload";
import { toast } from "sonner";
import type { AdminDetails } from "@/types/admin";

const FormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().optional(), // Read-only field, no validation needed
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  displayPhoto: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= 2 * 1024 * 1024; // 2MB limit
      },
      { message: "Image file size should be under 2MB" },
    )
    .refine(
      (file) => {
        if (!file) return true;
        return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type,
        );
      },
      { message: "Only JPEG, PNG, GIF, and WebP images are allowed" },
    ),
});

interface EditAdminFormProps {
  adminData?: AdminDetails;
}

const EditAdminForm: React.FC<EditAdminFormProps> = ({ adminData }) => {
  const updateAdminMutation = useUpdateAdmin();
  const imageUploadMutation = useSingleImageUpload();

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    adminData?.photoUrl || "/images/big-avatar.png",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: adminData?.firstName || "",
      lastName: adminData?.lastName || "",
      email: adminData?.email || "",
      phoneNumber: adminData?.phoneNumber || "",
      displayPhoto: undefined,
    },
  });

  // Early return if admin data is not available
  if (!adminData) {
    return (
      <div className="mt-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin data...</p>
      </div>
    );
  }

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file size should be under 2MB");
        return;
      }

      // Validate file type
      if (
        !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type,
        )
      ) {
        toast.error("Only JPEG, PNG, GIF, and WebP images are allowed");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPhotoPreview(adminData.photoUrl || "/images/big-avatar.png");
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      let photoUrl = adminData.photoUrl;

      // Upload image if a new one was selected
      if (selectedFile) {
        const uploadResponse =
          await imageUploadMutation.mutateAsync(selectedFile);
        photoUrl = uploadResponse.data || photoUrl;
      } else if (
        photoPreview === "/images/big-avatar.png" &&
        adminData.photoUrl
      ) {
        // User removed their photo, set to null
        photoUrl = null;
      }

      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        photoUrl: photoUrl,
      };

      await updateAdminMutation.mutateAsync({
        id: adminData.id,
        data: updateData,
      });

      toast.success("Admin profile updated successfully!");

      // Reset the selected file after successful update
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to update admin profile:", error);
      toast.error("Failed to update admin profile. Please try again.");
    }
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
              <div className="border-border relative h-20 w-20 overflow-hidden rounded-full border">
                <Image
                  src={photoPreview || "/images/big-avatar.png"}
                  alt="Profile Avatar"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
                {imageUploadMutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Icon
                      icon="material-symbols:upload"
                      className="animate-pulse text-white"
                      size="sm"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="displayPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-muted w-full rounded-md border text-center">
                              <input
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
                                  {selectedFile
                                    ? selectedFile.name
                                    : "Select image to upload"}
                                </span>
                                <Icon icon="material-symbols:upload-rounded" />
                              </label>
                            </div>
                          </div>
                          {(selectedFile || adminData.photoUrl) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                field.onChange(undefined);
                                handlePhotoChange(null);
                              }}
                              className="w-fit"
                            >
                              <Icon
                                icon="material-symbols:delete-outline"
                                className="mr-2"
                              />
                              Remove Photo
                            </Button>
                          )}
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
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    disabled
                    className="bg-muted cursor-not-allowed"
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

          <Button
            type="submit"
            className="w-full uppercase"
            disabled={
              updateAdminMutation.isPending || imageUploadMutation.isPending
            }
          >
            {imageUploadMutation.isPending ? (
              <>
                <Icon
                  icon="material-symbols:upload"
                  className="mr-2 animate-pulse"
                />
                Uploading Image...
              </>
            ) : updateAdminMutation.isPending ? (
              <>
                <Icon
                  icon="material-symbols:hourglass-empty"
                  className="mr-2 animate-spin"
                />
                Updating Admin...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditAdminForm;
