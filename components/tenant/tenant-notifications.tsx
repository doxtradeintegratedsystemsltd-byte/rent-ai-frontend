"use client";
import { useState } from "react";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/mutations/notification";
import NotificationCard from "@/components/admin/notifications/notification-card";
import { formatNotificationDate, formatNotificationTime } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Property as NotificationProperty } from "@/types/notification";

// Tenant notifications list (mirrors admin style)
const TenantNotifications = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const pageSize = 5;

  const { data, isLoading, error } = useGetNotifications(currentPage, pageSize);
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();

  const notifications = data?.data?.data || [];
  const filtered = showUnreadOnly
    ? notifications.filter((n) => !n.seen)
    : notifications;
  const unreadCount = notifications.filter((n) => !n.seen).length;

  const formatType = (type: string) => {
    switch (type) {
      case "rent_due":
        return "Rent Due";
      case "rent_overdue":
        return "Rent Overdue";
      case "rent_near_due":
        return "Rent Near Due";
      case "rent_paid":
        return "Rent Paid";
      default:
        return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };
  const formatProperty = (p: NotificationProperty) =>
    p ? `${p.propertyName}, ${p.propertyArea}, ${p.propertyState}` : "Property";

  if (isLoading) {
    return (
      <div className="mt-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 text-destructive mt-6 rounded-lg border p-4 text-center text-sm">
        Error loading notifications.
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-muted-foreground mt-6 text-center text-sm">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={showUnreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnreadOnly((v) => !v)}
          >
            {showUnreadOnly ? "Show All" : "Unread Only"}
          </Button>
          <span className="text-muted-foreground text-sm">
            {showUnreadOnly
              ? `${filtered.length} unread`
              : `${notifications.length} total`}
          </span>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            {markAllReadMutation.isPending ? "Marking..." : "Mark All as Read"}
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-muted-foreground text-center text-sm">
          {showUnreadOnly ? "No unread notifications." : "No notifications."}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map((n) => (
            <NotificationCard
              key={n.id}
              id={n.id}
              date={formatNotificationDate(n.createdAt)}
              time={formatNotificationTime(n.createdAt)}
              type={formatType(n.notificationType)}
              property={formatProperty(n.property)}
              propertyId={n.propertyId}
              isRead={n.seen}
              onMarkAsRead={() => markReadMutation.mutate(n.id)}
            />
          ))}

          {data?.data && data.data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {currentPage + 1} of {data.data.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(data.data.totalPages - 1, p + 1),
                  )
                }
                disabled={currentPage >= data.data.totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TenantNotifications;
