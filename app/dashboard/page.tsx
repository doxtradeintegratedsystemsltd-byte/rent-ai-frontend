import { YearPicker } from "@/components/ui/date-picker";
import { DatePickerExamples } from "@/components/ui/date-picker-examples";
import React from "react";

const DashboardPage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-muted-foreground text-sm font-medium uppercase">
          Overview
        </h1>
        <YearPicker placeholder="THIS YEAR" className="w-[120px]" />
      </div>
    </>
  );
};

export default DashboardPage;
