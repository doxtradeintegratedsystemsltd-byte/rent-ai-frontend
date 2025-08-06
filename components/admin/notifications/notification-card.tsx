import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";

interface NotificationCardProps {
  date: string;
  time: string;
  type: string;
  property: string;
  onDelete?: () => void;
}

const NotificationCard = ({
  date,
  time,
  type,
  property,
  onDelete,
}: NotificationCardProps) => {
  return (
    <Card className="bg-muted">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
            <span>{date}</span>
            <span>•</span>
            <span>{time}</span>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <div className="bg-foreground h-2 w-2 rounded-full"></div>
            <h3 className="text-foreground text-sm font-medium">{type}</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-secondary-foreground rounded-lg bg-[#d7d7d7] px-3 py-1 text-[10px] font-medium uppercase">
              PROPERTY
            </span>
            <span className="text-foreground text-xs font-semibold">
              {property}
            </span>
            <Link href="/admin/property/1" className="text-muted-foreground">
              ›
            </Link>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground p-1"
          onClick={onDelete}
        >
          <Icon icon="material-symbols:delete-outline-rounded" />
        </Button>
      </div>
    </Card>
  );
};

export default NotificationCard;
