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
import { Dropdown } from "@/components/ui/dropdown";
import { formatDropdownItems, formatCurrency } from "@/lib/formatters";
import { DatePicker } from "@/components/ui/date-picker";
import { Icon } from "@/components/ui/icon";
import Image from "next/image";
import { useAddTenantToProperty } from "@/mutations/tenant";
import { useSingleImageUpload } from "@/mutations/upload";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/error";

const FormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  levelOfEducation: z
    .string()
    .min(1, { message: "Level of education is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  paymentDate: z.string().min(1, { message: "Payment date is required" }),
  amountPaid: z.string().min(1, { message: "Amount paid is required" }),
  transactionReceipt: z.instanceof(File, {
    message: "Transaction receipt is required",
  }),
});

const levelOfEducationItems = [
  "Primary School",
  "Secondary School",
  "Tertiary Institution",
  "Postgraduate",
];

const AddTenantForm = ({
  rentAmount,
  propertyId,
  onSuccess,
}: {
  rentAmount: number;
  propertyId: string;
  onSuccess?: () => void;
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedPaymentDate, setSelectedPaymentDate] = useState<Date>();
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Initialize mutations
  const addTenantMutation = useAddTenantToProperty();
  const uploadImageMutation = useSingleImageUpload();

  // Generate payment cycle options
  const generatePaymentCycleOptions = () => {
    const cycles = [];
    for (let i = 1; i <= 12; i++) {
      const amount = rentAmount * i;
      const label = `${i} cycle${i > 1 ? "s" : ""} (${formatCurrency(amount)})`;
      cycles.push({
        label,
        value: amount.toString(),
      });
    }
    return cycles;
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      levelOfEducation: "",
      startDate: "",
      paymentDate: "",
      amountPaid: "",
      transactionReceipt: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // Upload the receipt image first - this is required
      let paymentReceiptUrl = "";
      if (data.transactionReceipt) {
        const uploadResponse = await uploadImageMutation.mutateAsync(
          data.transactionReceipt,
        );
        paymentReceiptUrl = uploadResponse.data || "";

        if (!paymentReceiptUrl) {
          toast.error(
            "Failed to upload receipt. Tenant cannot be created without a receipt.",
          );
          return;
        }
      } else {
        toast.error("Receipt is required for tenant creation.");
        return;
      }

      // Calculate lease cycles from the selected amount
      const selectedAmount = parseFloat(data.amountPaid);
      const leaseCycles = Math.round(selectedAmount / rentAmount);

      // Create payload for API
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        levelOfEducation: data.levelOfEducation,
        startDate: data.startDate,
        propertyId: propertyId,
        leaseCycles: leaseCycles,
        paymentReceipt: paymentReceiptUrl,
        paymentDate: data.paymentDate,
      };

      await addTenantMutation.mutateAsync(payload);
      toast.success("Tenant added successfully!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Error adding tenant:", error);
      const errorMessage = getApiErrorMessage(
        error,
        "Failed to add tenant. Please try again.",
      );

      if (errorMessage === "Next lease rent is already paid") {
        toast.error("Next lease rent is already paid!");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleReceiptChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

  const removeReceipt = () => {
    setReceiptPreview(null);
    form.resetField("transactionReceipt");
    setFileInputKey((prev) => prev + 1); // Force re-render of input to clear file
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
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter tenant's email address" {...field} />
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
              <FormLabel required>Phone Number</FormLabel>
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
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground font-medium uppercase">Tenancy</p>
          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel required className="text-sm">
                    Start date
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      date={selectedStartDate}
                      onDateSelect={(date) => {
                        setSelectedStartDate(date);
                        field.onChange(date?.toISOString() || "");
                      }}
                      placeholder="Select start date"
                      className="w-full text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-6"></div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground font-medium uppercase">
            Rent Payment
          </p>
          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel required className="text-sm">
                    Date of payment
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      date={selectedPaymentDate}
                      onDateSelect={(date) => {
                        setSelectedPaymentDate(date);
                        field.onChange(date?.toISOString() || "");
                      }}
                      placeholder="Select payment date"
                      className="w-full text-sm"
                      disableFuture
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel required className="text-sm">
                    Amount paid
                  </FormLabel>
                  <FormControl>
                    <Dropdown
                      trigger={{
                        label: field.value
                          ? generatePaymentCycleOptions().find(
                              (option) => option.value === field.value,
                            )?.label || "Select amount paid"
                          : "Select amount paid",
                        arrowIcon: "material-symbols:keyboard-arrow-down",
                        className: "w-full justify-between",
                      }}
                      items={generatePaymentCycleOptions()}
                      onItemSelect={(value) => field.onChange(value)}
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
            name="transactionReceipt"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="text-sm">
                  Bank transaction receipt
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
                          handleReceiptChange(e.target.files[0]);
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
                  {!receiptPreview && "Image file size should be under 2MB."}
                </p>

                {receiptPreview && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-muted-foreground mb-2 text-sm">
                      Receipt preview
                    </p>
                    <div className="">
                      <div className="border-border relative h-28 w-28 overflow-hidden rounded-lg border">
                        <Image
                          width={112}
                          height={80}
                          src={receiptPreview}
                          alt="Receipt preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={removeReceipt}
                        className="text-muted-foreground hover:text-foreground mt-2 h-auto p-0"
                      >
                        Remove receipt
                      </Button>
                    </div>
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full uppercase"
          disabled={
            !form.formState.isValid ||
            addTenantMutation.isPending ||
            uploadImageMutation.isPending
          }
        >
          {addTenantMutation.isPending || uploadImageMutation.isPending ? (
            <>
              <Icon
                icon="material-symbols:progress-activity"
                className="mr-2 animate-spin"
              />
              {uploadImageMutation.isPending
                ? "Uploading..."
                : "Adding Tenant..."}
            </>
          ) : (
            "Add Tenant"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddTenantForm;
