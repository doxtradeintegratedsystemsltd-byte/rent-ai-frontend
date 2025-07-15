"use client";

import * as React from "react";
import {
  DatePicker,
  YearPicker,
  MonthPicker,
  DateRangePicker,
  CompactDatePicker,
} from "./date-picker";

export function DatePickerExamples() {
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedYear, setSelectedYear] = React.useState<Date>();
  const [selectedMonth, setSelectedMonth] = React.useState<Date>();
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>();
  const [compactDate, setCompactDate] = React.useState<Date>();

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Standard Date Picker</h3>
        <DatePicker
          date={selectedDate}
          onDateSelect={setSelectedDate}
          placeholder="Pick a date"
        />
        {selectedDate && (
          <p className="text-muted-foreground text-sm">
            Selected: {selectedDate.toDateString()}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Year Picker</h3>
        <YearPicker
          date={selectedYear}
          onDateSelect={setSelectedYear}
          placeholder="Select year"
          className="w-[200px]"
        />
        {selectedYear && (
          <p className="text-muted-foreground text-sm">
            Selected: {selectedYear.getFullYear()}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Month Picker</h3>
        <MonthPicker
          date={selectedMonth}
          onDateSelect={setSelectedMonth}
          placeholder="Select month"
          className="w-[200px]"
        />
        {selectedMonth && (
          <p className="text-muted-foreground text-sm">
            Selected:{" "}
            {selectedMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Date Range Picker</h3>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeSelect={setDateRange}
          placeholder="Pick a date range"
        />
        {dateRange?.from && (
          <p className="text-muted-foreground text-sm">
            Selected: {dateRange.from.toDateString()}
            {dateRange.to && ` - ${dateRange.to.toDateString()}`}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Compact Date Picker</h3>
        <CompactDatePicker
          date={compactDate}
          onDateSelect={setCompactDate}
          placeholder="Date"
        />
        {compactDate && (
          <p className="text-muted-foreground text-sm">
            Selected: {compactDate.toDateString()}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Different Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <DatePicker
            date={selectedDate}
            onDateSelect={setSelectedDate}
            placeholder="Default"
            buttonVariant="default"
            className="w-[200px]"
          />
          <DatePicker
            date={selectedDate}
            onDateSelect={setSelectedDate}
            placeholder="Ghost"
            buttonVariant="ghost"
            className="w-[200px]"
          />
          <DatePicker
            date={selectedDate}
            onDateSelect={setSelectedDate}
            placeholder="Secondary"
            buttonVariant="secondary"
            className="w-[200px]"
          />
        </div>
      </div>
    </div>
  );
}
