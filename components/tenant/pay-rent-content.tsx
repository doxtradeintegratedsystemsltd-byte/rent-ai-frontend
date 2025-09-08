"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInitiatePayment } from "@/mutations/payment";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TenantPropertyInfo } from "@/types/lease";
import { formatLongDate } from "@/lib/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/error";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PayRentContent = ({
  leaseData,
  paymentStatus,
}: {
  leaseData: TenantPropertyInfo | undefined;
  paymentStatus?: "completed" | "pending" | "failed";
}) => {
  const [selectedCycles, setSelectedCycles] = useState(1);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // success UI toggle
  const [isPaymentFailed, setIsPaymentFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract rent amount and lease years from lease data
  const rentAmount = Number(leaseData?.rentAmount) || 1000000;
  const leaseYears = leaseData?.leaseYears || 1;
  const totalAmount = rentAmount * selectedCycles;

  // Generate payment cycles dynamically based on lease years
  const generatePaymentCycles = () => {
    const cycles = [];
    const maxCycles = leaseYears * 12; // Convert years to months for maximum cycles

    // Common cycle options (1, 2, 3, 6, 12 months)
    const commonCycles = [1, 2, 3, 6, 12];

    for (const cycleCount of commonCycles) {
      if (cycleCount <= maxCycles) {
        const amount = rentAmount * cycleCount;
        const label = `${cycleCount} cycle${cycleCount > 1 ? "s" : ""} (₦${amount.toLocaleString()})`;
        cycles.push({ value: cycleCount, label });
      }
    }

    return cycles;
  };

  const paymentCycles = generatePaymentCycles();

  const { mutate: initiatePayment, isPending } = useInitiatePayment();

  const handlePayment = () => {
    if (!leaseData?.currentLeaseId) {
      setErrorMsg("Missing lease identifier.");
      return;
    }
    setErrorMsg(null);
    initiatePayment(
      {
        leaseId: leaseData.currentLeaseId,
        leaseCycles: selectedCycles,
      },
      {
        onSuccess: (resp) => {
          if (resp?.data) {
            // Redirect tenant to checkout page (Paystack URL)
            try {
              window.location.href = resp.data;
            } catch (e) {
              // Fallback open new tab
              console.error("Error redirecting to payment URL:", e);
              toast.error(
                getApiErrorMessage(
                  e,
                  "Failed to redirect to payment URL. Please try again.",
                ),
              );
              window.open(resp.data, "_blank");
            }
          } else {
            setErrorMsg("No checkout URL returned.");
            setIsPaymentFailed(true);
          }
        },
        onError: (err) => {
          setIsPaymentFailed(true);
          console.error(err);
          setErrorMsg(
            getApiErrorMessage(
              err,
              "Failed to initiate payment. Please try again.",
            ),
          );
          toast.error(
            getApiErrorMessage(
              err,
              "Failed to initiate payment. Please try again.",
            ),
          );
        },
      },
    );
  };

  const handleGoBackHome = () => {
    setIsPaymentSuccessful(false);
    setIsPaymentFailed(false);
  };

  // On success, also clear the `reference` query param from the URL
  const handleGoBackHomeSuccess = () => {
    setIsPaymentSuccessful(false);
    setIsPaymentFailed(false);

    const params = new URLSearchParams(searchParams?.toString());
    if (params.has("reference")) {
      params.delete("reference");
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      // Replace so we don't add an extra history entry
      router.replace(newUrl);
    }
  };

  const handleTryAgain = () => {
    setIsPaymentFailed(false);
  };

  if (isPaymentFailed) {
    return (
      <div className="mt-8 flex flex-col items-center gap-6 text-center">
        {/* Failure Icon */}
        <div className="flex items-center justify-center">
          <Image
            src="/images/X.png"
            alt="Payment Failed"
            width={80}
            height={80}
            className="h-20 w-20"
          />
        </div>

        {/* Failure Message */}
        <h3 className="text-xl font-semibold">Rent payment failed</h3>

        {/* Payment Summary */}
        <div className="w-full">
          <div className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Payment Summary
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  House
                </p>
                <p className="text-sm font-medium">
                  {leaseData?.propertyName || "N/A"},{" "}
                  {leaseData?.propertyAddress || "N/A"},{" "}
                  {leaseData?.propertyState || "N/A"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  Amount Paid
                </p>
                <p className="text-sm font-medium">
                  ₦{totalAmount.toLocaleString()} ({selectedCycles} cycle
                  {selectedCycles > 1 ? "s" : ""})
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  Due Date
                </p>
                <p className="text-sm font-medium">
                  {leaseData?.currentLease?.endDate
                    ? formatLongDate(leaseData.currentLease.endDate)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <p className="text-destructive text-xs font-medium">{errorMsg}</p>
        )}

        {/* Action Buttons */}
        <div className="flex w-full gap-3">
          <Button className="flex-1 text-xs" onClick={handleTryAgain}>
            GO BACK & TRY AGAIN
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-xs"
            onClick={handleGoBackHome}
          >
            BACK TO HOME
          </Button>
        </div>
      </div>
    );
  }

  // Payment Success UI (also if external status indicates completed)
  if (isPaymentSuccessful || paymentStatus === "completed") {
    return (
      <div className="mt-8 flex flex-col items-center gap-6 text-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center">
          <Image
            src="/images/check.png"
            alt="Payment Successful"
            width={80}
            height={80}
            className="h-20 w-20"
          />
        </div>

        {/* Success Message */}
        <h3 className="text-xl font-semibold">Rent paid successfully</h3>

        {/* Payment Summary */}
        <div className="w-full">
          <div className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Payment Summary
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  House
                </p>
                <p className="text-sm font-medium">
                  {leaseData?.propertyName || "N/A"},{" "}
                  {leaseData?.propertyAddress || "N/A"},{" "}
                  {leaseData?.propertyState || "N/A"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  Amount Paid
                </p>
                <p className="text-sm font-medium">
                  ₦{totalAmount.toLocaleString()} ({selectedCycles} cycle
                  {selectedCycles > 1 ? "s" : ""})
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  Due Date
                </p>
                <p className="text-sm font-medium">
                  {leaseData?.currentLease?.endDate
                    ? formatLongDate(leaseData.currentLease.endDate)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Go Back Home Button */}
        <Button
          className="bg-foreground text-background hover:bg-foreground/90 w-full"
          onClick={handleGoBackHomeSuccess}
        >
          GO BACK HOME
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Rent Amount */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-medium uppercase">
          Rent Amount
        </p>
        <p className="font-medium">₦{rentAmount.toLocaleString()}/Year</p>
      </div>

      {/* Payment Duration Selector */}
      <div className="flex flex-col gap-3">
        <p className="font-medium">What duration do you want to pay for? *</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full justify-between px-4 py-3"
            >
              <span>
                {
                  paymentCycles.find((cycle) => cycle.value === selectedCycles)
                    ?.label
                }
              </span>
              <Icon icon="material-symbols:keyboard-arrow-down" size="sm" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
            {paymentCycles.map((cycle) => (
              <DropdownMenuItem
                key={cycle.value}
                onClick={() => setSelectedCycles(cycle.value)}
                className="cursor-pointer"
              >
                {cycle.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Proceed Button */}
      {errorMsg && (
        <p className="text-destructive -mt-2 text-xs font-medium">{errorMsg}</p>
      )}

      <Button
        className="w-full text-sm uppercase"
        onClick={handlePayment}
        disabled={isPending || !leaseData?.id}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner size="sm" /> Processing...
          </span>
        ) : (
          <span className="flex items-center">
            PROCEED TO PAY ₦{totalAmount.toLocaleString()}
            <Icon
              icon="material-symbols:arrow-right-alt"
              className="ml-2"
              size="sm"
            />
          </span>
        )}
      </Button>
    </div>
  );
};

export default PayRentContent;
