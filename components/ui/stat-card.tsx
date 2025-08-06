import React from "react";
import Card from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle = "-",
}) => {
  return (
    <Card className="bg-background w-full">
      <p className="text-muted-foreground text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold" style={{ lineHeight: "40px" }}>
        {value}
      </p>
      <p>{subtitle}</p>
    </Card>
  );
};

export default StatCard;
