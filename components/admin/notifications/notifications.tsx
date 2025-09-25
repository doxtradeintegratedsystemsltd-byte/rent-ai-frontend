import React, { useState } from "react";
import NotificationCard from "./notification-card";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/mutations/notification";
import { Property } from "@/types/notification";
import { formatNotificationDate, formatNotificationTime } from "@/lib/time";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const pageSize = 10;

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useGetNotifications(
    currentPage,
    pageSize,
    showUnreadOnly ? false : undefined,
  );

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // You could add a toast notification here
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      // You could add a toast notification here
    }
  };

  const formatNotificationType = (type: string): string => {
    switch (type) {
      case "rent_due":
        return "Rent Due";
      case "rent_overdue":
        return "Rent Overdue";
      case "rent_paid":
        return "Rent Paid";
      case "custom":
        return "Custom Notification";
      default:
        return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const formatPropertyName = (
    property: Property | null | undefined,
  ): string => {
    if (!property) {
      return "Property information unavailable";
    }
    return `${property.propertyName || "Unknown Property"}, ${property.location?.name || "-"},`;
  };

  if (isLoading) {
    return (
      <div className="mt-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 text-destructive mt-6 rounded-lg border p-4 text-center">
        Error loading notifications. Please try again.
      </div>
    );
  }

  const notifications = notificationsData?.data?.data || [];
  const filteredNotifications = notifications; // backend handles filtering when seen flag is provided

  const unreadCount = notifications.filter(
    (notification) => !notification.seen,
  ).length;

  if (notifications.length === 0) {
    return (
      <div className="text-muted-foreground mt-6 text-center">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Filter Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={showUnreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          >
            {showUnreadOnly ? "Show All" : "Unread Only"}
          </Button>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
          >
            {markAllAsReadMutation.isPending
              ? "Marking..."
              : "Mark All as Read"}
          </Button>
        )}
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-muted-foreground text-center">
          {showUnreadOnly
            ? "No unread notifications."
            : "No notifications found."}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              id={notification.id}
              date={formatNotificationDate(notification.createdAt)}
              time={formatNotificationTime(notification.createdAt)}
              type={formatNotificationType(notification.notificationType)}
              property={formatPropertyName(notification.property)}
              propertyId={notification.propertyId || ""}
              isRead={notification.seen}
              onMarkAsRead={() => handleMarkAsRead(notification.id)}
            />
          ))}

          {notificationsData?.data && notificationsData.data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {currentPage + 1} of {notificationsData.data.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      notificationsData.data.totalPages - 1,
                      currentPage + 1,
                    ),
                  )
                }
                disabled={currentPage >= notificationsData.data.totalPages - 1}
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
export default Notifications;
