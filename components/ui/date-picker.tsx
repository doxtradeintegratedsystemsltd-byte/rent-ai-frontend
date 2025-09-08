"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/icon";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Base DatePicker Props
interface DatePickerProps {
  date?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  disableFuture?: boolean;
}

// Year Picker Component
export function YearPicker({
  date,
  onDateSelect,
  placeholder = "Select year",
  className,
  disabled = false,
  buttonVariant = "outline",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i);

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, 0, 1);
    onDateSelect?.(newDate);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          disabled={disabled}
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground justify-start rounded-md px-2 py-1.5 text-left text-[10px] font-medium",
            className,
          )}
        >
          <Icon icon="material-symbols:calendar-month-outline" size="sm" />
          {date ? format(date, "yyyy") : <span>{placeholder}</span>}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto">
          {years.map((year) => (
            <Button
              key={year}
              variant={
                date && format(date, "yyyy") === year.toString()
                  ? "default"
                  : "ghost"
              }
              size="sm"
              onClick={() => handleYearSelect(year)}
              className="h-8 text-sm"
            >
              {year}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Month Picker Component
export function MonthPicker({
  date,
  onDateSelect,
  placeholder = "Select month",
  className,
  disabled = false,
  buttonVariant = "outline",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(2024, i, 1);
    return {
      value: i,
      label: format(monthDate, "MMMM"),
      short: format(monthDate, "MMM"),
    };
  });

  const handleMonthSelect = (monthIndex: number) => {
    const year = date?.getFullYear() || new Date().getFullYear();
    const newDate = new Date(year, monthIndex, 1);
    onDateSelect?.(newDate);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          disabled={disabled}
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
            className,
          )}
        >
          <Icon icon="material-symbols:calendar-month-outline" size="lg" />
          {date ? format(date, "MMMM yyyy") : <span>{placeholder}</span>}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="grid grid-cols-3 gap-2">
          {months.map((month) => (
            <Button
              key={month.value}
              variant={
                date && date.getMonth() === month.value ? "default" : "ghost"
              }
              size="sm"
              onClick={() => handleMonthSelect(month.value)}
              className="h-8 text-sm"
            >
              {month.short}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Standard Date Picker Component
export function DatePicker({
  date,
  onDateSelect,
  placeholder = "Pick a date",
  className,
  disabled = false,
  disableFuture = false,
  buttonVariant = "outline",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          disabled={disabled}
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal",
            className,
          )}
        >
          <Icon icon="material-symbols:calendar-month-outline" size="lg" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          disableFuture={disableFuture}
          mode="single"
          selected={date}
          onSelect={onDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

// Date Range Picker Component
interface DateRangePickerProps {
  dateRange?: { from: Date | undefined; to?: Date | undefined };
  onDateRangeSelect?: (
    range: { from: Date | undefined; to?: Date | undefined } | undefined,
  ) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
}

export function DateRangePicker({
  dateRange,
  onDateRangeSelect,
  placeholder = "Pick a date range",
  className,
  disabled = false,
  buttonVariant = "outline",
}: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          disabled={disabled}
          data-empty={!dateRange?.from}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-[300px] justify-start text-left font-normal",
            className,
          )}
        >
          <Icon icon="material-symbols:calendar-month-outline" size="lg" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}

// Compact Date Picker (minimal width)
export function CompactDatePicker({
  date,
  onDateSelect,
  placeholder = "Date",
  className,
  disabled = false,
  buttonVariant = "outline",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          disabled={disabled}
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-[140px] justify-start text-left font-normal",
            className,
          )}
        >
          <Icon icon="material-symbols:calendar-month-outline" size="lg" />
          {date ? format(date, "MM/dd/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={onDateSelect} />
      </PopoverContent>
    </Popover>
  );
}

// Demo component for backward compatibility
export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();

  return (
    <DatePicker date={date} onDateSelect={setDate} placeholder="Pick a date" />
  );
}
