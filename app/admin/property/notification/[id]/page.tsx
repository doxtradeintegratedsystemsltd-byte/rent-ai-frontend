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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useFetchProperty } from "@/mutations/property";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatLongDate, formatCurrency, formatAmount } from "@/lib/formatters";
import { useCreateNotification } from "@/mutations/notification";
import { toast } from "sonner";
import { RentStatus } from "@/types/lease";

const FormSchema = z.object({
  messageTitle: z.string().min(1, { message: "Message title is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

const NotificationPage = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  // Fetch property data
  const {
    data: propertyResponse,
    isLoading,
    isError,
    error,
  } = useFetchProperty(propertyId);

  const property = propertyResponse?.data;

  const createNotification = useCreateNotification();

  // Dynamic tenant details grid
  const tenantDetailsGrid = property?.currentLease?.tenant
    ? [
        {
          label: "Phone",
          value: property.currentLease.tenant.phoneNumber || "N/A",
        },
        {
          label: "Email",
          value: property.currentLease.tenant.email || "N/A",
        },
        {
          label: "Level of Education",
          value: property.currentLease.tenant.levelOfEducation || "N/A",
        },
      ]
    : [];

  // Dynamic tenancy details grid
  const tenancyDetailsGrid = property?.currentLease
    ? [
        {
          label: "Start Date",
          value: property.currentLease.startDate
            ? formatLongDate(property.currentLease.startDate)
            : "N/A",
        },
        {
          label: "End Date",
          value: property.currentLease.endDate
            ? formatLongDate(property.currentLease.endDate)
            : "N/A",
        },
        {
          label: "Rent Amount",
          value: formatCurrency(
            formatAmount((property.currentLease.rentAmount || 0).toString()),
          ),
        },
        {
          label: "Status",
          value: property.currentLease.rentStatus || "N/A",
        },
      ]
    : [
        {
          label: "Lease Years",
          value: property?.leaseYears ? `${property.leaseYears} years` : "N/A",
        },
        {
          label: "Rent Amount",
          value: formatCurrency(
            formatAmount((property?.rentAmount || 0).toString()),
          ),
        },
        {
          label: "Status",
          value: "No active lease",
        },
      ];

  useBreadcrumb([
    { name: "Houses", href: "/admin" },
    {
      name: property?.propertyName || "N/A",
      href: propertyId ? `/admin/property/${propertyId}` : "#",
    },
    { name: "Send Notification", href: "#" },
  ]);

  const tenant = !!property?.currentLease?.tenant;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      messageTitle: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!property?.currentLeaseId) {
      toast.error("No active lease found for this property.");
      return;
    }

    if (!data.messageTitle?.trim() || !data.message?.trim()) {
      toast.error("Message title and content are required.");
      return;
    }

    const payload = {
      leaseId: property.currentLeaseId,
      notificationTitle: data.messageTitle.trim(),
      notificationContent: data.message.trim(),
    };

    try {
      await createNotification.mutateAsync(payload);
      toast.success("Notification sent successfully!");
      form.reset();
    } catch {
      toast.error("Failed to send notification.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-muted-foreground">Loading house details...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Icon
          icon="material-symbols:error-outline"
          size="xl"
          className="text-red-600"
        />
        <div className="text-center">
          <h2 className="text-lg font-semibold">Error loading house</h2>
          <p className="text-muted-foreground">
            {error?.message || "Something went wrong. Please try again."}
          </p>
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // Property not found
  if (!property) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Icon
          icon="material-symbols:home-outline"
          size="xl"
          className="text-muted-foreground"
        />
        <div className="text-center">
          <h2 className="text-lg font-semibold">House not found</h2>
          <p className="text-muted-foreground">
            The house you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // No tenant assigned
  if (!tenant) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Icon
          icon="material-symbols:person-off-outline"
          size="xl"
          className="text-muted-foreground"
        />
        <div className="text-center">
          <h2 className="text-lg font-semibold">No tenant assigned</h2>
          <p className="text-muted-foreground">
            This house doesn&apos;t have a tenant assigned. You can only send
            notifications to houses with active tenants.
          </p>
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

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
                  disabled={
                    !form.formState.isValid || createNotification.isPending
                  }
                >
                  <Icon
                    icon="material-symbols:send-outline-rounded"
                    className="mr-2"
                  />
                  {createNotification.isPending
                    ? "Sending..."
                    : "Send Notification"}
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
            <h2 className="text-lg font-bold">
              {property?.propertyName || "N/A"}
            </h2>
          </div>
          <Card className="bg-muted flex items-start gap-2 py-6">
            <div className="border-border text-foreground after:bg-secondary-foreground relative mr-1 rounded-full border p-2 after:absolute after:top-full after:left-1/2 after:h-8 after:w-px after:-translate-x-1/2">
              <Icon
                icon="material-symbols:distance-outline-rounded"
                size="lg"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-md font-semibold">
                {property?.location?.name || "-"}
              </p>
              <p className="text-md">{property?.propertyAddress || "N/A"}</p>
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
                  <p className="text-lg font-semibold">
                    {property?.currentLease?.tenant
                      ? `${property.currentLease.tenant.firstName || "N/A"} ${property.currentLease.tenant.lastName || ""}`.trim()
                      : "No tenant assigned"}
                  </p>
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
                            getPaymentStatus(item.value as RentStatus),
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
