"use client";

import React from "react";
import { useParams } from "next/navigation";
import LocationPropertiesTable from "@/components/super/locations/location-properties-table";
import { GoBackButton } from "@/components/ui/go-back-button";
import { useFetchLocation } from "@/mutations/locations";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const AdminLocationPage = () => {
  const params = useParams();
  const locationId = params.id as string;
  const { data } = useFetchLocation(locationId);
  const locationName = data?.data?.name || "Location";

  useBreadcrumb([
    { name: "Dashboard", href: "/admin" },
    { name: locationName, href: "#" },
  ]);

  return (
    <div className="flex flex-col gap-4">
      <GoBackButton className="self-start" />
      <LocationPropertiesTable
        locationId={locationId}
        title={`Houses in ${locationName}`}
        propertyBasePath="/admin/property"
      />
    </div>
  );
};

export default AdminLocationPage;
