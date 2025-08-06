import { YearPicker } from "../ui/date-picker";
import StatCard from "../ui/stat-card";

const statsData = [
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

const DashboardStats = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-muted-foreground text-sm font-medium uppercase">
          Overview
        </h1>
        <YearPicker placeholder="THIS YEAR" className="w-[120px]" />
      </div>
      <div className="flex w-full items-center gap-8">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
