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

const PayRentContent = () => {
  const [selectedCycles, setSelectedCycles] = useState(1);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [isPaymentFailed, setIsPaymentFailed] = useState(false);

  const rentAmount = 1000000;
  const totalAmount = rentAmount * selectedCycles;

  const paymentCycles = [
    { value: 1, label: "1 cycle (₦1,000,000)" },
    { value: 2, label: "2 cycles (₦2,000,000)" },
    { value: 3, label: "3 cycles (₦3,000,000)" },
    { value: 6, label: "6 cycles (₦6,000,000)" },
    { value: 12, label: "12 cycles (₦12,000,000)" },
  ];

  const handlePayment = () => {
    // Simulate payment processing - randomly succeed or fail for demo
    const shouldFail = Math.random() > 0.5; // 50% chance of failure for demo

    if (shouldFail) {
      setIsPaymentFailed(true);
    } else {
      setIsPaymentSuccessful(true);
    }
  };

  const handleGoBackHome = () => {
    // Reset all states to go back to the payment form
    setIsPaymentSuccessful(false);
    setIsPaymentFailed(false);
  };

  const handleTryAgain = () => {
    // Reset failure state to try payment again
    setIsPaymentFailed(false);
  };

  // Payment Failed UI
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
                  Property
                </p>
                <p className="text-sm font-medium">
                  Bull House, Axelaxe, Abuja
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
                <p className="text-sm font-medium">January 1, 2025</p>
              </div>
            </div>
          </div>
        </div>

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

  // Payment Success UI
  if (isPaymentSuccessful) {
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
                  Property
                </p>
                <p className="text-sm font-medium">
                  Bull House, Axelaxe, Abuja
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
                <p className="text-sm font-medium">January 1, 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Go Back Home Button */}
        <Button
          className="bg-foreground text-background hover:bg-foreground/90 w-full"
          onClick={handleGoBackHome}
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
        <p className="font-medium">₦1,000,000/Year</p>
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
      <Button className="w-full text-sm uppercase" onClick={handlePayment}>
        PROCEED TO PAY ₦{totalAmount.toLocaleString()}
        <Icon
          icon="material-symbols:arrow-right-alt"
          className="ml-2"
          size="sm"
        />
      </Button>
    </div>
  );
};

export default PayRentContent;
