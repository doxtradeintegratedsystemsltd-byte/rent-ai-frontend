import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const PropertyManagement = () => {
  return (
    <div className="flex items-center justify-between rounded-md bg-gradient-to-r from-[#1E1E1E] to-[#4B4B4B] p-6">
      <div className="flex w-full items-center gap-4">
        <p className="text-background w-full text-lg font-bold">
          Property Management
        </p>
        <div className="border-x-accent-foreground flex w-full flex-col items-center gap-2 border-x-2 p-4">
          <p className="text-accent text-sm font-medium uppercase">DUE RENTS</p>
          <div className="flex items-center gap-2">
            <Icon
              icon="material-symbols:circle"
              className="text-destructive h-2 w-2"
            />
            <p className="text-background text-lg font-bold">0</p>
            <Link href="/" className="text-accent hover:underline">
              View
            </Link>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <Button className="uppercase" variant="secondary">
            <Icon
              icon="material-symbols:add-home-outline-rounded"
              className="mr-2 size-6"
            />
            Add Property
          </Button>
        </div>
      </div>
      <Image
        src="/images/auth-mobile.png"
        alt="Login Side Image"
        width={282}
        height={200}
        className="h-[100px] w-[141px]"
        quality={100}
        unoptimized
      />
    </div>
  );
};

export default PropertyManagement;
