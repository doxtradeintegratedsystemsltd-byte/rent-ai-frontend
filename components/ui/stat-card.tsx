import Card from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string | ReactNode;
  period?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle = "-",
  period = "period",
}) => {
  return (
    <Card className="bg-background w-full">
      <p className="text-muted-foreground text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold" style={{ lineHeight: "40px" }}>
        {value}
      </p>
      <p className="text-accent-foreground text-xs">
        {subtitle} from last {period}
      </p>
    </Card>
  );
};

export default StatCard;
