import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";

interface NotificationCardProps {
  id: string;
  date: string;
  time: string;
  type: string;
  property: string;
  propertyId?: string;
  isRead?: boolean;
  onMarkAsRead?: () => void;
}

const NotificationCard = ({
  date,
  time,
  type,
  property,
  propertyId,
  isRead = false,
  onMarkAsRead,
}: NotificationCardProps) => {
  return (
    <Card
      className={`bg-muted cursor-pointer transition-opacity ${!isRead ? "border-l-primary border-l-4" : "opacity-75"}`}
      onClick={!isRead ? onMarkAsRead : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
            <span>{date}</span>
            <span>•</span>
            <span>{time}</span>
            {!isRead && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                NEW
              </span>
            )}
          </div>

          <div className="mb-2 flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${!isRead ? "bg-primary" : "bg-muted-foreground"}`}
            ></div>
            <h3 className="text-foreground text-sm font-medium">{type}</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-secondary-foreground rounded-lg bg-[#d7d7d7] px-3 py-1 text-[10px] font-medium uppercase">
              HOUSE
            </span>
            <span className="text-foreground text-xs font-semibold">
              {property}
            </span>
            {propertyId && (
              <Link
                href={`/admin/property/${propertyId}`}
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                ›
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRead && onMarkAsRead && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground p-1"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
              title="Mark as read"
            >
              <Icon icon="material-symbols:mark-email-read-outline" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;
