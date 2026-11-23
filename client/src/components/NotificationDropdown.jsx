import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const { notifications, unreadCount } = state;

  return (
    <section
      id="notifications-dropdown"
      role="dialog"
      aria-label="Notifications"
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        zIndex: 50,
        width: "min(360px, calc(100vw - 32px))",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#fff",
        color: "#0f172a",
        boxShadow: "0 16px 40px rgba(15, 23, 42, 0.2)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 16px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>
            Notifications
          </h2>
          <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "0.75rem" }}>
            {unreadCount} unread
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "MARK_ALL_READ" })}
          disabled={unreadCount === 0}
          style={{
            padding: "6px 8px",
            border: 0,
            borderRadius: 7,
            background: "transparent",
            color: unreadCount === 0 ? "#94a3b8" : "#4f46e5",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: unreadCount === 0 ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Mark all as read
        </button>
      </header>

      {notifications.length > 0 ? (
        <ul
          aria-label="Notification list"
          style={{
            maxHeight: 390,
            overflowY: "auto",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))}
        </ul>
      ) : (
        <p
          style={{
            margin: 0,
            padding: "28px 18px",
            color: "#64748b",
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          You’re all caught up. No notifications yet.
        </p>
      )}
    </section>
  );
}
