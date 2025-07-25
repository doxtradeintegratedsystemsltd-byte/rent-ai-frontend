"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Icon } from "@/components/ui/icon";
import { getPaymentStatus } from "@/lib/status-util";
import { paymentStatus } from "@/types/status";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBreadcrumb, createBreadcrumbs } from "@/hooks/useBreadcrumb";

const tenantDetailsGrid = [
  {
    label: "Phone",
    value: "08123456789",
  },
  {
    label: "Email",
    value: "aadebayo@gmail.com",
  },
  {
    label: "Level of Education",
    value: "Tertiary",
  },
  {
    label: "Job",
    value: "Accountant",
  },
];

const tenancyDetailsGrid = [
  {
    label: "Start Date",
    value: "January 1, 2025",
  },
  {
    label: "End Date",
    value: "December 31, 2025",
  },
  {
    label: "Rent Amount",
    value: "₦1,000,000",
  },
  {
    label: "Status",
    value: "paid",
  },
];

const FormSchema = z.object({
  messageTitle: z.string().min(1, { message: "Message title is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

const NotificationPage = () => {
  useBreadcrumb({
    items: createBreadcrumbs([
      { name: "Properties", href: "/dashboard" },
      { name: "Axel Home", href: "/dashboard/property/1" },
      { name: "Send Notification", href: "#" },
    ]),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      messageTitle: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Notification form submitted with data:", data);
    // Handle form submission logic here
  };

  const handleSendWhatsApp = () => {
    const data = form.getValues();
    if (form.formState.isValid) {
      console.log("Sending WhatsApp message with data:", data);
      // Handle WhatsApp sending logic here
    } else {
      form.trigger(); // Trigger validation to show errors
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <GoBackButton className="self-start" />

      <Card className="grid grid-cols-2 gap-8 p-6">
        {/* Notification Form*/}
        <div className="flex h-full flex-col gap-4">
          <h2 className="text-lg font-bold">Notification</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="messageTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Message Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Message title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel required>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Compose message"
                        {...field}
                        className="min-h-[200px] flex-1 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-auto flex gap-3">
                <Button
                  type="submit"
                  className="text-xs uppercase"
                  size="md"
                  disabled={!form.formState.isValid}
                >
                  <Icon
                    icon="material-symbols:send-outline-rounded"
                    className="mr-2"
                  />
                  Send Notification
                </Button>
                <Button
                  type="button"
                  className="text-xs uppercase"
                  variant="outline"
                  size="md"
                  onClick={handleSendWhatsApp}
                  disabled={!form.formState.isValid}
                >
                  <Icon
                    icon="ic:baseline-whatsapp"
                    className="text-[#25D366]"
                  />
                  Send On WhatsApp
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Tenant Information */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="border-secondary-foreground text-secondary-foreground relative rounded-full border p-2">
              <Icon icon="material-symbols:home-app-logo" size="lg" />
            </div>
            <h2 className="text-lg font-bold">Axel Home</h2>
          </div>
          <Card className="bg-muted flex items-start gap-2 py-6">
            <div className="border-border text-foreground after:bg-secondary-foreground relative mr-1 rounded-full border p-2 after:absolute after:top-full after:left-1/2 after:h-8 after:w-px after:-translate-x-1/2">
              <Icon
                icon="material-symbols:distance-outline-rounded"
                size="lg"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-md font-semibold">Gwarimpa, Abuja</p>
              <p className="text-md">20, Malami Street, GRA, Gwarimpa, Abuja</p>
            </div>
          </Card>
          {/* Tenant Information */}
          <Card className="bg-muted flex flex-col gap-6">
            <h2 className="text-md text-muted-foreground font-medium uppercase">
              Tenant
            </h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="bg-border text-foreground relative mr-1 rounded-full p-2">
                    <Icon
                      icon="material-symbols:location-home-outline-rounded"
                      size="lg"
                    />
                  </div>
                  <p className="text-lg font-semibold">Abdul Adebayo</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {tenantDetailsGrid.map((item) => (
                    <div className="flex flex-col gap-1" key={item.label}>
                      <p className="text-muted-foreground text-xs font-medium uppercase">
                        {item.label}
                      </p>
                      <p className="text-foreground text-sm font-medium">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="bg-background flex flex-col gap-5 rounded-md p-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase">Tenancy</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {tenancyDetailsGrid.map((item) => (
                    <div className="flex flex-col gap-1" key={item.label}>
                      <p className="text-muted-foreground text-xs font-medium uppercase">
                        {item.label}
                      </p>
                      <p
                        className={cn(
                          "text-foreground text-sm font-medium",
                          item.label === "Status" &&
                            getPaymentStatus(item.value as paymentStatus),
                        )}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default NotificationPage;
