import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

export default function NotificationItem({ notification, onClose }) {
  const { state, dispatch } = useNotifications();

  const markAsRead = useMutation({
    mutationFn: (notificationId) =>
      apiClient.patch(`/api/notifications/${notificationId}/read`),
    onMutate: (notificationId) => {
      const previousNotifications = state.notifications;
      dispatch({ type: "MARK_READ", payload: notificationId });
      return { previousNotifications };
    },
    onError: async (_error, _notificationId, context) => {
      try {
        const response = await apiClient.get("/api/notifications");
        dispatch({ type: "LOAD_NOTIFICATIONS", payload: response.data });
      } catch (refreshError) {
        console.error("[NotificationItem] Could not refresh notifications:", refreshError);
        if (context && Array.isArray(context.previousNotifications)) {
          dispatch({
            type: "LOAD_NOTIFICATIONS",
            payload: context.previousNotifications,
          });
        }
      }
    },
  });

  const timestamp = notification.createdAt || notification.timestamp;
  const createdAt = timestamp ? new Date(timestamp) : null;
  const hasValidDate = createdAt && !Number.isNaN(createdAt.getTime());
  const message = notification.message || "You have a new notification.";

  function handleClick() {
    if (!notification.isRead) markAsRead.mutate(notification.id);
    onClose?.();
  }

  return (
    <li style={{ borderBottom: "1px solid #f1f5f9" }}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${notification.isRead ? "Read" : "Unread"}: ${message}`}
        style={{
          display: "flex",
          width: "100%",
          gap: 11,
          alignItems: "flex-start",
          padding: "13px 16px",
          border: 0,
          background: notification.isRead ? "#fff" : "#f5f7ff",
          color: "inherit",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            flex: "0 0 9px",
            width: 9,
            height: 9,
            marginTop: 5,
            borderRadius: "50%",
            background: notification.isRead ? "transparent" : "#4f46e5",
            boxShadow: notification.isRead ? "inset 0 0 0 1px #cbd5e1" : "none",
          }}
        />
        <span style={{ display: "block", minWidth: 0, flex: 1 }}>
          <span
            style={{
              display: "block",
              marginBottom: 5,
              color: notification.isRead ? "#475569" : "#1e293b",
              fontSize: "0.85rem",
              fontWeight: notification.isRead ? 400 : 600,
              lineHeight: 1.45,
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </span>
          <time
            dateTime={hasValidDate ? createdAt.toISOString() : undefined}
            style={{ display: "block", color: "#94a3b8", fontSize: "0.72rem" }}
          >
            {hasValidDate ? createdAt.toLocaleString() : "Just now"}
          </time>
        </span>
      </button>
    </li>
  );
}
