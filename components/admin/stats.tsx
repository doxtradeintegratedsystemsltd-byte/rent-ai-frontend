import { useState } from "react";
import { Dropdown } from "../ui/dropdown";
import StatCard from "../ui/stat-card";
import { useDashboardStats } from "@/mutations/stats";
import type { DashboardPeriod } from "@/types/stats";
import Card from "../ui/card";

// Period options for the dropdown
const periodOptions = [
  { label: "Today", value: "today", period: "day" },
  { label: "This Week", value: "thisWeek", period: "week" },
  { label: "Last Week", value: "lastWeek", period: "week" },
  { label: "This Month", value: "thisMonth", period: "month" },
  { label: "Last Month", value: "lastMonth", period: "month" },
  { label: "This Quarter", value: "thisQuarter", period: "quarter" },
  { label: "Last Quarter", value: "lastQuarter", period: "quarter" },
  { label: "This Year", value: "thisYear", period: "year" },
  { label: "Last Year", value: "lastYear", period: "year" },
  { label: "Last 30 Days", value: "last30Days", period: "30 days" },
  { label: "Last 365 Days", value: "last365Days", period: "365 days" },
  { label: "All Time", value: "oldestDate" },
];

const DashboardStats = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<DashboardPeriod>("thisWeek");

  const {
    data: statsResponse,
    isLoading,
    error,
  } = useDashboardStats(selectedPeriod);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value as DashboardPeriod);
  };

  // Get the selected period label for display
  const selectedPeriodLabel =
    periodOptions.find((option) => option.value === selectedPeriod)?.label ||
    "This Week";

  const selectedPeriodName =
    periodOptions.find((option) => option.value === selectedPeriod)?.period ||
    "week";

  // Helper function to calculate percentage change and format with color
  const calculatePercentageChange = (
    current: number,
    previous: number,
    prefix: string = "",
  ) => {
    if (previous === 0) {
      // If previous is 0, we can't calculate percentage, so show absolute change
      const change = current - previous;
      const isPositive = change >= 0;
      return (
        <span
          className={`text-sm font-semibold ${isPositive ? "text-[#00BF1D]" : "text-red-600"}`}
        >
          {isPositive ? "↗" : "↘"} {isPositive ? "+" : ""}
          {prefix}
          {change.toLocaleString()}
        </span>
      );
    }

    const percentageChange = ((current - previous) / previous) * 100;
    const isPositive = percentageChange >= 0;

    return (
      <span
        className={`text-sm font-semibold ${isPositive ? "text-[#00BF1D]" : "text-red-600"}`}
      >
        {isPositive ? "↗" : "↘"} {isPositive ? "+" : ""}
        {percentageChange.toFixed(1)}%
      </span>
    );
  };

  // Format the stats data
  const statsData = statsResponse?.data
    ? [
        {
          title: "Properties",
          value: statsResponse.data.properties.all,
          subtitle: calculatePercentageChange(
            statsResponse.data.properties.current,
            statsResponse.data.properties.previous,
          ),
        },
        {
          title: "Tenants",
          value: statsResponse.data.tenants.all,
          subtitle: calculatePercentageChange(
            statsResponse.data.tenants.current,
            statsResponse.data.tenants.previous,
          ),
        },
        {
          title: "Rent Processed",
          value: `₦${statsResponse.data.payments.all.toLocaleString()}`,
          subtitle: calculatePercentageChange(
            statsResponse.data.payments.current,
            statsResponse.data.payments.previous,
            "₦",
          ),
        },
      ]
    : [
        {
          title: "Properties",
          value: 0,
          subtitle: "-",
        },
        {
          title: "Tenants",
          value: 0,
          subtitle: "-",
        },
        {
          title: "Rent Processed",
          value: "₦0",
          subtitle: "-",
        },
      ];

  if (error) {
    console.error("Error loading dashboard stats:", error);
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-muted-foreground text-sm font-medium uppercase">
          Overview
        </h1>
        <Dropdown
          trigger={{
            label: selectedPeriodLabel,
            icon: "material-symbols:calendar-month",
            arrowIcon: "material-symbols:keyboard-arrow-down",
            className: "w-[180px] uppercase text-xs font-medium",
          }}
          items={periodOptions}
          onItemSelect={handlePeriodChange}
          selectedValue={selectedPeriod}
          useRadioGroup={true}
        />
      </div>
      <div className="flex w-full items-center gap-8">
        {isLoading
          ? // Loading skeleton
            Array(3)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={index}
                  className="bg-border h-[110px] w-full animate-pulse"
                />
              ))
          : statsData.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                period={selectedPeriodName}
              />
            ))}
      </div>
    </div>
  );
};

export default DashboardStats;
