import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080"); // backend port

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // fetch old notifications
    axios
      .get("http://localhost:8080/api/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));

    // listen for real-time notifications
    socket.on("newNotification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => socket.off("newNotification");
  }, []);

  return (
    <div className="max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-2">
        Notifications ({notifications.length})
      </h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li key={n._id} className="border p-2 rounded shadow-sm">
              <strong>{n.type}</strong> - {n.message}
              <br />
              <small>{new Date(n.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
