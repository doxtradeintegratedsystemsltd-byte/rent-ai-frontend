import React, { useState } from "react";
import NotificationCard from "./notification-card";

interface Notification {
  id: string;
  date: string;
  time: string;
  type: string;
  property: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      date: "JAN 1, 2025",
      time: "10:00AM",
      type: "Rent Paid",
      property: "Castle Castle, Gwarimpa, Abuja",
    },
    {
      id: "2",
      date: "JAN 1, 2025",
      time: "10:00AM",
      type: "Rent Due",
      property: "Castle Castle, Gwarimpa, Abuja",
    },
    {
      id: "3",
      date: "DEC 28, 2024",
      time: "2:30PM",
      type: "Rent Paid",
      property: "Villa Heights, Maitama, Abuja",
    },
    {
      id: "4",
      date: "DEC 25, 2024",
      time: "9:15AM",
      type: "Rent Due",
      property: "Garden City, Asokoro, Abuja",
    },
  ]);

  const handleDeleteNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          date={notification.date}
          time={notification.time}
          type={notification.type}
          property={notification.property}
          onDelete={() => handleDeleteNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default Notifications;
