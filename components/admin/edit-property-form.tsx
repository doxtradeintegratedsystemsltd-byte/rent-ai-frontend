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
import { useMemo, useState, useEffect } from "react";
import { useFetchLocations } from "@/mutations/locations";
import type { Location } from "@/types/locations";
import { Icon } from "@/components/ui/icon";
// (useState, useEffect) already imported above with useMemo
import Image from "next/image";
import { usePropertyImageUpload } from "@/mutations/upload";
import { useUpdateProperty } from "@/mutations/property";
import { toast } from "sonner";
import { Property } from "@/types/property";
import { getApiErrorMessage } from "@/lib/error";

const FormSchema = z.object({
  propertyName: z.string().min(1, { message: "House name is required" }),
  locationId: z.string().min(1, { message: "House location is required" }),
  propertyAddress: z.string().min(1, { message: "Address is required" }),
  propertyImage: z.union([
    z.instanceof(File),
    z.string().url({ message: "Valid image URL is required" }),
  ]),
  leaseYears: z.number().min(1, { message: "Lease duration is required" }),
  rentAmount: z.number().min(1, { message: "Rent amount is required" }),
});

interface PropertySubmissionData {
  propertyName: string;
  locationId: string;
  propertyAddress: string;
  propertyImage: string;
  leaseYears: number;
  rentAmount: number;
}

interface EditPropertyFormProps {
  property: Property;
  onSuccess?: () => void;
}

const EditPropertyForm = ({ property, onSuccess }: EditPropertyFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    property?.propertyImage || null,
  );
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const imageUpload = usePropertyImageUpload();
  const updateProperty = useUpdateProperty();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      propertyName: property?.propertyName || "",
      locationId: property?.location?.id || "",
      propertyAddress: property?.propertyAddress || "",
      propertyImage: property?.propertyImage || "",
      leaseYears: property?.leaseYears || 1,
      rentAmount: parseInt(property?.rentAmount || "0") || 0,
    },
  });

  // Update form values when property changes
  useEffect(() => {
    if (property) {
      form.reset({
        propertyName: property.propertyName || "",
        locationId: property.location?.id || "",
        propertyAddress: property.propertyAddress || "",
        propertyImage: property.propertyImage || "",
        leaseYears: property.leaseYears || 1,
        rentAmount: parseInt(property.rentAmount || "0") || 0,
      });
      setImagePreview(property.propertyImage || null);
    }
  }, [property, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      let propertyImageUrl = property?.propertyImage || "";

      // Upload new image if it was changed
      if (isImageChanged && data.propertyImage instanceof File) {
        propertyImageUrl = await imageUpload.uploadImageForProperty(
          data.propertyImage,
        );
      }

      const submissionData: PropertySubmissionData = {
        propertyName: data.propertyName,
        locationId: data.locationId,
        propertyAddress: data.propertyAddress,
        propertyImage: propertyImageUrl,
        leaseYears: data.leaseYears,
        rentAmount: data.rentAmount,
      };

      await updateProperty.mutateAsync({
        id: property.id,
        propertyData: submissionData,
      });

      toast.success("House updated successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error updating house:", error);
      toast.error(
        getApiErrorMessage(error, "Failed to update house. Please try again."),
      );
    }
  };

  // Fetch locations for dropdown
  const { data: locationsData, isLoading: isLocationsLoading } =
    useFetchLocations({ page: 0, pageSize: 100, sortOrder: "DESC" });
  const locationOptions = useMemo(
    () =>
      ((locationsData?.data?.data as Location[] | undefined) || []).map(
        (loc) => ({
          label: loc.name,
          value: loc.id,
        }),
      ),
    [locationsData],
  );

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setIsImageChanged(true);
    } else {
      setImagePreview(property?.propertyImage || null);
      setIsImageChanged(false);
    }
  };

  const removeImage = () => {
    setImagePreview(property?.propertyImage || null);
    form.setValue("propertyImage", property?.propertyImage || "");
    setFileInputKey((prev) => prev + 1); // Force re-render of input to clear file
    setIsImageChanged(false);
  };

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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="text-sm">
                House location
              </FormLabel>
              <FormControl>
                <Dropdown
                  trigger={{
                    label:
                      locationOptions.find((o) => o.value === field.value)
                        ?.label ||
                      (isLocationsLoading
                        ? "Loading locations..."
                        : "Select location"),
                    arrowIcon: "material-symbols:keyboard-arrow-down",
                    className: `w-full justify-between ${isLocationsLoading ? "opacity-50 pointer-events-none" : ""}`,
                  }}
                  items={locationOptions}
                  onItemSelect={(value) =>
                    !isLocationsLoading && field.onChange(value)
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
            name="leaseYears"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required className="text-sm">
                  Lease duration (years)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    className="py-2"
                    placeholder="Enter lease duration"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                  Rent amount (₦)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    className="py-2"
                    placeholder="Enter rent amount"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                      Select image to upload
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
        <Button
          type="submit"
          className="w-full uppercase"
          disabled={
            !form.formState.isValid ||
            updateProperty.isPending ||
            imageUpload.isPending
          }
        >
          {updateProperty.isPending || imageUpload.isPending ? (
            <>
              <Icon
                icon="material-symbols:progress-activity"
                className="mr-2 animate-spin"
              />
              {imageUpload.isPending ? "Uploading..." : "Updating..."}
            </>
          ) : (
            "Update House"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditPropertyForm;
