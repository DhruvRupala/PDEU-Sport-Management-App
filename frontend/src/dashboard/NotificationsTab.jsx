import { useState } from "react"

function NotificationsTab({ data }) {
  const { notifications } = data
  const [readIds, setReadIds] = useState(new Set())

  const markRead = (id) => {
    setReadIds(prev => new Set([...prev, id]))
  }

  const markAllRead = () => {
    setReadIds(new Set(notifications.map(n => n._id)))
  }

  const unreadCount = notifications.filter(n => !n.read && !readIds.has(n._id)).length

  const getTypeIcon = (type) => {
    const map = {
      payment:      { icon: "fa-credit-card", bg: "rgba(237,137,54,0.1)", color: "#ed8936" },
      event:        { icon: "fa-trophy", bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
      match:        { icon: "fa-calendar-days", bg: "rgba(20,184,166,0.1)", color: "#14b8a6" },
      announcement: { icon: "fa-bullhorn", bg: "rgba(166,25,46,0.1)", color: "#a6192e" },
      result:       { icon: "fa-medal", bg: "rgba(46,125,50,0.1)", color: "#2e7d32" },
    }
    return map[type] || map.announcement
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{ background: "#a6192e", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginLeft: 10, verticalAlign: "middle" }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>Stay updated with your sports activities</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={markAllBtn}>
            <i className="fa-solid fa-check-double" style={{ marginRight: 6 }} />Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <i className="fa-solid fa-bell-slash" style={{ fontSize: 52, color: "#ddd", marginBottom: 16 }} />
          <p style={{ fontSize: 18, color: "#888", margin: 0 }}>No notifications</p>
          <p style={{ fontSize: 13, color: "#bbb", marginTop: 6 }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifications.map(n => {
            const isRead = n.read || readIds.has(n._id)
            const typeStyle = getTypeIcon(n.type)
            return (
              <div
                key={n._id}
                style={{ ...notifCard, ...(isRead ? notifRead : notifUnread) }}
                onClick={() => markRead(n._id)}
                className="animate-fade"
              >
                {/* Unread dot */}
                {!isRead && <div style={unreadDot} />}

                {/* Icon */}
                <div style={{ ...notifIcon, background: typeStyle.bg, color: typeStyle.color }}>
                  <i className={`fa-solid ${n.icon || typeStyle.icon}`} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <h4 style={{ fontSize: 14, fontWeight: isRead ? 500 : 700, color: "#1a1a1a", margin: 0 }}>{n.title}</h4>
                    <span style={{ fontSize: 11, color: "#aaa", whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(n.time)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0", lineHeight: 1.4 }}>{n.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Styles ── */
const markAllBtn = {
  display: "flex", alignItems: "center", padding: "8px 18px",
  background: "#fff", color: "#a6192e", border: "1px solid rgba(166,25,46,0.2)",
  borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
  transition: "all 0.2s"
}

const notifCard = {
  display: "flex", alignItems: "flex-start", gap: 14,
  padding: "16px 20px", borderRadius: 14, cursor: "pointer",
  transition: "all 0.2s", position: "relative"
}

const notifUnread = {
  background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(166,25,46,0.1)"
}

const notifRead = {
  background: "rgba(255,255,255,0.5)", border: "1px solid #f0ebe0"
}

const unreadDot = {
  position: "absolute", top: 18, left: 8,
  width: 8, height: 8, borderRadius: "50%", background: "#a6192e"
}

const notifIcon = {
  width: 42, height: 42, borderRadius: 12,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 16, flexShrink: 0
}

export default NotificationsTab
