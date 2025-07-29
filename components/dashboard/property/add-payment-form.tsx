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
import { DatePicker } from "@/components/ui/date-picker";
import { Icon } from "@/components/ui/icon";

const FormSchema = z.object({
  paymentDate: z.string().min(1, { message: "Payment date is required" }),
  amountPaid: z.string().min(1, { message: "Amount paid is required" }),
  transactionReceipt: z.instanceof(File, {
    message: "Property image is required",
  }),
});

const AddPaymentForm = () => {
  const [selectedPaymentDate, setSelectedPaymentDate] = useState<Date>();
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      paymentDate: "",
      amountPaid: "",
      transactionReceipt: undefined,
    },
  });

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
    form.setValue("transactionReceipt", undefined as any);
    setFileInputKey((prev) => prev + 1); // Force re-render of input to clear file
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel required className="text-sm">
                Amount paid
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter amount paid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                      <img
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

        <Button
          type="submit"
          className="w-full uppercase"
          disabled={!form.formState.isValid}
        >
          Add Payment
        </Button>
      </form>
    </Form>
  );
};

export default AddPaymentForm;
